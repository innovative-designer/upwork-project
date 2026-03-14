"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { AppShell } from "@/components/app-shell";

function MetricCard({ label, value, helper, accentClass, refreshVersion }) {
  return (
    <article
      className={`glass-panel metric-shine rounded-[1.6rem] p-6 ${accentClass} ${
        refreshVersion > 0 ? "refresh-flash" : "fade-in-up"
      }`}
    >
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
        {label}
      </p>
      <p className="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
        {value}
      </p>
      <p className="mt-4 max-w-xs text-sm leading-6 text-slate-600">{helper}</p>
    </article>
  );
}

export function DashboardView() {
  const { i18n, t } = useTranslation();
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshVersion, setRefreshVersion] = useState(0);

  useEffect(() => {
    let isCancelled = false;

    const loadMetrics = async () => {
      try {
        const response = await fetch("/api/metrics", { cache: "no-store" });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to load metrics.");
        }

        if (!isCancelled) {
          setMetrics(data);
          setError("");
          setLoading(false);
          setRefreshVersion((value) => value + 1);
        }
      } catch (requestError) {
        if (!isCancelled) {
          setError(requestError.message);
          setLoading(false);
        }
      }
    };

    loadMetrics();
    const intervalId = window.setInterval(loadMetrics, 10000);

    return () => {
      isCancelled = true;
      window.clearInterval(intervalId);
    };
  }, []);

  const formattedUpdatedTime = metrics?.lastUpdated
    ? new Intl.DateTimeFormat(i18n.resolvedLanguage || "en", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit"
      }).format(new Date(metrics.lastUpdated))
    : t("dashboard.waiting");

  const numberFormatter = new Intl.NumberFormat(i18n.resolvedLanguage || "en");

  const cards = [
    {
      key: "requests",
      label: t("dashboard.cards.requests"),
      value: metrics ? numberFormatter.format(metrics.requestsMade) : "--",
      helper: t("dashboard.cardHelp.requests"),
      accentClass: "bg-white/85"
    },
    {
      key: "tokens",
      label: t("dashboard.cards.tokens"),
      value: metrics ? numberFormatter.format(metrics.tokensUsed) : "--",
      helper: t("dashboard.cardHelp.tokens"),
      accentClass: "bg-[rgba(8,126,139,0.08)]"
    },
    {
      key: "connections",
      label: t("dashboard.cards.connections"),
      value: metrics ? numberFormatter.format(metrics.activeConnections) : "--",
      helper: t("dashboard.cardHelp.connections"),
      accentClass: "bg-[rgba(255,122,89,0.12)]"
    },
    {
      key: "sessions",
      label: t("dashboard.cards.sessions"),
      value: metrics ? numberFormatter.format(metrics.completedSessions) : "--",
      helper: t("dashboard.cardHelp.sessions"),
      accentClass: "bg-[rgba(15,23,42,0.05)]"
    }
  ];

  return (
    <AppShell
      eyebrow={t("dashboard.eyebrow")}
      title={t("dashboard.title")}
      description={t("dashboard.description")}
    >
      <section className="grid gap-6 lg:grid-cols-[1.25fr_0.85fr]">
        <div className="grid gap-6 md:grid-cols-2">
          {cards.map((card) => (
            <MetricCard
              key={card.key}
              label={card.label}
              value={card.value}
              helper={card.helper}
              accentClass={card.accentClass}
              refreshVersion={refreshVersion}
            />
          ))}
        </div>

        <aside className="glass-panel fade-in-up rounded-[1.6rem] p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                {t("dashboard.sidePanel.title")}
              </p>
              <h2 className="heading-display mt-3 text-3xl text-slate-900">
                {t("dashboard.sidePanel.heading")}
              </h2>
            </div>
            <div className="rounded-full bg-[rgba(8,126,139,0.12)] px-3 py-2 text-sm font-semibold text-[color:var(--accent)]">
              {t("dashboard.sidePanel.badge")}
            </div>
          </div>

          <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
            <p>{t("dashboard.sidePanel.polling")}</p>
            <p>{t("dashboard.sidePanel.networking")}</p>
            <p>{t("dashboard.sidePanel.persistence")}</p>
          </div>

          <div className="mt-8 grid gap-4">
            <div className="rounded-[1.4rem] border border-slate-900/8 bg-white/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                {t("dashboard.status.lastUpdated")}
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {formattedUpdatedTime}
              </p>
            </div>
            <div className="rounded-[1.4rem] border border-slate-900/8 bg-white/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                {t("dashboard.status.health")}
              </p>
              <p className="mt-2 text-base font-semibold text-slate-900">
                {loading
                  ? t("dashboard.loading")
                  : error || t("dashboard.status.healthy")}
              </p>
            </div>
          </div>
        </aside>
      </section>
    </AppShell>
  );
}
