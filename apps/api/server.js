const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../../.env")
});
require("dotenv").config();

const cors = require("cors");
const express = require("express");
const { Pool } = require("pg");
const Stripe = require("stripe");

const app = express();

const PORT = Number(process.env.API_PORT || 4000);
const DATABASE_URL =
  process.env.DATABASE_URL ||
  `postgresql://${process.env.POSTGRES_USER || "postgres"}:${process.env.POSTGRES_PASSWORD || "postgres"}@${process.env.POSTGRES_HOST || "localhost"}:${process.env.POSTGRES_PORT || "5432"}/${process.env.POSTGRES_DB || "upwork_demo"}`;
const WEB_ORIGIN = process.env.WEB_ORIGIN || "http://localhost:3000";
const STRIPE_CURRENCY = process.env.STRIPE_CURRENCY || "usd";
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

const pool = new Pool({
  connectionString: DATABASE_URL
});

const seededMessages = [
  {
    sender: "Ava from BrightLane",
    subject: "Client follow-up needed",
    preview: "Please send the revised proposal before Friday afternoon.",
    aiSummary:
      "The client wants a proposal update this week and is waiting on final pricing confirmation."
  },
  {
    sender: "Marcus, Ops Team",
    subject: "Incident recap draft",
    preview: "The draft is ready for review before we circulate it internally.",
    aiSummary:
      "Operations prepared a recap draft and needs a quick approval pass before distribution."
  },
  {
    sender: "Nina at Helio",
    subject: "Partnership request",
    preview: "Can we schedule time next week to discuss a small pilot integration?",
    aiSummary:
      "A potential partner is requesting a discovery call for a pilot integration next week."
  },
  {
    sender: "Finance Bot",
    subject: "Invoice discrepancy",
    preview: "Invoice #1042 appears to include an extra seat charge.",
    aiSummary:
      "Finance flagged a billing discrepancy and needs confirmation before sending the invoice."
  },
  {
    sender: "Daniel, Support",
    subject: "Escalated user complaint",
    preview: "The customer reported repeat login issues after the latest release.",
    aiSummary:
      "Support escalated a login issue affecting an unhappy customer after the newest deployment."
  }
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }

      const allowedOrigins = new Set([WEB_ORIGIN]);
      const isLocalBrowserOrigin = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(
        origin
      );

      if (allowedOrigins.has(origin) || isLocalBrowserOrigin) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin ${origin} is not allowed by CORS.`));
    },
    credentials: true
  })
);
app.use(express.json());

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForDatabase() {
  for (let attempt = 1; attempt <= 20; attempt += 1) {
    try {
      await pool.query("SELECT 1");
      return;
    } catch (error) {
      if (attempt === 20) {
        throw error;
      }

      console.log(`Database not ready yet (attempt ${attempt}/20). Retrying...`);
      await sleep(3000);
    }
  }
}

async function seedMessagesIfNeeded() {
  const { rows } = await pool.query("SELECT COUNT(*)::int AS count FROM messages");
  if (rows[0].count > 0) {
    return;
  }

  for (const message of seededMessages) {
    await pool.query(
      `
        INSERT INTO messages (sender, subject, preview, ai_summary)
        VALUES ($1, $2, $3, $4)
      `,
      [message.sender, message.subject, message.preview, message.aiSummary]
    );
  }
}

async function initializeDatabase() {
  await waitForDatabase();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      sender TEXT NOT NULL,
      subject TEXT NOT NULL,
      preview TEXT NOT NULL,
      ai_summary TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS billing_sessions (
      id SERIAL PRIMARY KEY,
      started_at TIMESTAMPTZ NOT NULL,
      ended_at TIMESTAMPTZ NOT NULL,
      seconds_elapsed INTEGER NOT NULL,
      rate_cents INTEGER NOT NULL,
      actual_total_cents INTEGER NOT NULL,
      charged_total_cents INTEGER NOT NULL,
      payment_intent_id TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await seedMessagesIfNeeded();
}

function buildMetricSnapshot(completedSessions) {
  const tick = Math.floor(process.uptime() / 10);

  return {
    requestsMade: 1280 + tick * 19,
    tokensUsed: 54200 + tick * 780,
    activeConnections: 9 + (tick % 5),
    completedSessions,
    lastUpdated: new Date().toISOString()
  };
}

app.get("/health", async (_request, response) => {
  try {
    await pool.query("SELECT 1");

    response.json({
      status: "ok",
      db: "connected",
      stripeConfigured: Boolean(stripe)
    });
  } catch (error) {
    response.status(500).json({
      status: "error",
      db: "disconnected",
      error: error.message
    });
  }
});

app.get("/metrics", async (_request, response) => {
  try {
    const { rows } = await pool.query(
      "SELECT COUNT(*)::int AS count FROM billing_sessions"
    );

    response.json(buildMetricSnapshot(rows[0].count));
  } catch (error) {
    response.status(500).json({ error: "Unable to load live metrics." });
  }
});

app.get("/messages", async (_request, response) => {
  try {
    const { rows } = await pool.query(`
      SELECT id, sender, subject, preview, ai_summary
      FROM messages
      ORDER BY id ASC
      LIMIT 5
    `);

    response.json(
      rows.map((row) => ({
        id: row.id,
        sender: row.sender,
        subject: row.subject,
        preview: row.preview,
        aiSummary: row.ai_summary
      }))
    );
  } catch (error) {
    response.status(500).json({ error: "Unable to load messages." });
  }
});

app.post("/billing/create-payment-intent", async (request, response) => {
  try {
    if (!stripe) {
      response.status(500).json({
        error: "Stripe is not configured. Set STRIPE_SECRET_KEY before testing billing."
      });
      return;
    }

    const startedAt = request.body.startedAt
      ? new Date(request.body.startedAt)
      : new Date();
    const endedAt = request.body.endedAt ? new Date(request.body.endedAt) : new Date();
    const secondsElapsed = Number(request.body.secondsElapsed);

    if (!Number.isFinite(secondsElapsed) || secondsElapsed <= 0) {
      response.status(400).json({ error: "secondsElapsed must be a positive number." });
      return;
    }

    const rateCents = 2;
    const actualTotalCents = Math.round(secondsElapsed * rateCents);
    const chargedTotalCents = Math.max(actualTotalCents, 50);
    const minimumApplied = chargedTotalCents !== actualTotalCents;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: chargedTotalCents,
      currency: STRIPE_CURRENCY,
      automatic_payment_methods: {
        enabled: true
      },
      metadata: {
        actual_total_cents: String(actualTotalCents),
        charged_total_cents: String(chargedTotalCents),
        billed_seconds: String(secondsElapsed),
        minimum_applied: String(minimumApplied)
      }
    });

    await pool.query(
      `
        INSERT INTO billing_sessions (
          started_at,
          ended_at,
          seconds_elapsed,
          rate_cents,
          actual_total_cents,
          charged_total_cents,
          payment_intent_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
      [
        startedAt.toISOString(),
        endedAt.toISOString(),
        secondsElapsed,
        rateCents,
        actualTotalCents,
        chargedTotalCents,
        paymentIntent.id
      ]
    );

    response.status(201).json({
      paymentIntentId: paymentIntent.id,
      actualTotalCents,
      chargedTotalCents,
      minimumApplied,
      currency: STRIPE_CURRENCY
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({
      error: "Unable to create Stripe payment intent.",
      details: error.message
    });
  }
});

async function start() {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`API listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start API:", error);
    process.exit(1);
  }
}

start();
