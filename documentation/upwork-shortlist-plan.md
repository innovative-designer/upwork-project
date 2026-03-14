# Upwork Shortlist Demo Plan

## Goal

Build a small demo repo that satisfies all five shortlist tasks:

1. Next.js live dashboard with real-time counters
2. Expo mobile approve/reject screen
3. Docker Compose stack with Next.js, Express, and PostgreSQL
4. Multi-language support with RTL layout
5. Stripe metered billing flow

This document is our implementation reference and execution checklist.

## Proposed Project Structure

```text
UpworkJobApply/
  apps/
    web/         # Next.js 14 + Tailwind + i18n + Stripe UI
    api/         # Express API + PostgreSQL access + Stripe server logic
    mobile/      # Expo app for approve/reject flow
  documentation/
    upwork-shortlist-plan.md
  docker-compose.yml
  .env.example
  README.md
```

## Shared Technical Decisions

### Monorepo Approach

- Use a single repo with separate app folders for web, API, and mobile.
- Keep setup simple enough for a shortlist submission and easy to explain in a Loom video.

### API Strategy

- Use one Express API for:
  - live dashboard metrics
  - mock messages for mobile
  - Stripe PaymentIntent creation
  - optional database-backed demo records

### Real-Time Update Strategy

- Use polling every 10 seconds for the dashboard.
- This satisfies the requirement without the extra complexity of WebSockets.

### Database Strategy

- Use PostgreSQL primarily to prove service connectivity in Docker.
- Store simple session or metrics-related demo records where helpful.

### Internationalization Strategy

- Use `react-i18next` in the Next.js app.
- Support:
  - English (`en`)
  - Arabic (`ar`) for RTL
  - Spanish (`es`)

### Billing Strategy

- Cost rate: `$0.02/second`
- Create a Stripe PaymentIntent only when the session ends.
- Show the final amount and PaymentIntent ID in the UI.

## Task 1 Plan: Live Dashboard With Real-Time Data

### Objective

Create a clean Next.js dashboard page with at least 3 counters that update automatically every 10 seconds without a page refresh.

### Scope

- Build a dashboard page in the Next.js app
- Display at least 3 counters:
  - requests made
  - tokens used
  - active connections
- Fetch from a custom API endpoint
- Update data every 10 seconds
- Style with Tailwind CSS

### Implementation Plan

1. Create a dashboard route in the web app.
2. Build an API endpoint in the Express app: `GET /metrics`.
3. Return changing values from the API to simulate live activity.
4. In the dashboard client component:
   - fetch metrics on load
   - poll every 10 seconds
   - update the displayed counters in place
5. Add UI states:
   - loading
   - fetch error
   - last updated time
6. Style the page with Tailwind stat cards and responsive layout.

### Deliverable Checklist

- Dashboard page renders correctly
- 3 or more counters are visible
- Values update automatically every 10 seconds
- No refresh is required
- UI looks clean on desktop and mobile

## Task 2 Plan: Mobile Approve / Reject Flow

### Objective

Build one Expo screen that fetches a small list of messages and lets the user approve or reject them.

### Scope

- One React Native screen in Expo
- Fetch 3 to 5 messages from the API
- Each message includes:
  - message text/title
  - hardcoded AI summary
- Approve moves item to a `Handled` section
- Reject removes item from the main list
- Must work on iOS and Android

### Implementation Plan

1. Create an Expo app in `apps/mobile`.
2. Add a simple screen with:
   - active messages section
   - handled messages section
3. Create API endpoint: `GET /messages`.
4. Return 3 to 5 mock message objects with hardcoded summary text.
5. On `Approve`:
   - remove from active list
   - add to handled list
6. On `Reject`:
   - remove from active list only
7. Use simple cross-platform styling with React Native components.

### Deliverable Checklist

- Messages load from API
- AI summaries are visible
- Approve updates handled section
- Reject removes the message
- Screen works on both platforms in Expo

## Task 3 Plan: Docker Compose Multi-Service Stack

### Objective

Run the web app, API, and PostgreSQL together using only `docker compose up`.

### Scope

- `docker-compose.yml`
- Next.js service
- Express API service
- PostgreSQL service
- Internal Docker networking between all services
- `.env.example`

### Implementation Plan

1. Add Dockerfiles for web and API services.
2. Create `docker-compose.yml` with:
   - `web`
   - `api`
   - `db`
3. Configure environment variables:
   - database URL / host / port
   - API base URL
   - Stripe secret key
   - public web variables as needed
4. Ensure API connects to PostgreSQL on container startup.
5. Ensure web connects to API using Docker service naming.
6. Add health checks or startup ordering if needed.
7. Add `.env.example` documenting all required variables.

### Deliverable Checklist

- `docker compose up` starts all 3 services
- Web can reach API
- API can reach PostgreSQL
- Environment variables are documented

## Task 4 Plan: Multi-Language With RTL Support

### Objective

Add a language switcher to the dashboard with full text translation, RTL support, and saved preference.

### Scope

- Languages:
  - English
  - Arabic
  - Spanish
- All visible dashboard text translated
- Arabic layout switches to RTL
- Language choice persists across refreshes

### Implementation Plan

1. Install and configure `react-i18next` in the web app.
2. Create translation files for:
   - `en`
   - `ar`
   - `es`
3. Add a language switcher component to the dashboard.
4. Apply translated strings to:
   - page title
   - section titles
   - card labels
   - loading/error text
   - timestamps or helper labels
5. Switch page `dir` based on current locale.
6. Adjust layout and alignment for RTL so Arabic looks correct.
7. Persist preference with cookie or local storage.

### Deliverable Checklist

- Language switcher works
- All visible text changes
- Arabic uses RTL layout
- Language persists after refresh

## Task 5 Plan: Stripe Metered Billing Flow

### Objective

Build a session-based billing page with a live running cost and Stripe PaymentIntent creation when the session ends.

### Scope

- Page with:
  - `Start Session`
  - `End Session`
- Live timer
- Running cost at `$0.02/second`
- Final cost display
- Stripe test mode PaymentIntent creation
- PaymentIntent ID shown on screen

### Implementation Plan

1. Create a billing page in the Next.js app.
2. On `Start Session`:
   - store start timestamp in client state
   - begin updating elapsed time every second
   - compute running cost live
3. On `End Session`:
   - stop timer
   - compute final duration and total amount
   - send total to Express API
4. Create API endpoint: `POST /billing/create-payment-intent`.
5. In API:
   - validate amount
   - convert to Stripe smallest currency unit
   - create PaymentIntent using Stripe test secret key
6. Return:
   - payment intent ID
   - amount
   - status if useful
7. Show final amount and PaymentIntent ID in UI.
8. Optionally store session records in PostgreSQL for demo completeness.

### Deliverable Checklist

- Session starts and timer updates live
- Cost updates every second
- Final amount is correct
- Stripe PaymentIntent is created in test mode
- PaymentIntent ID is displayed

## Recommended Build Order

1. Initialize repo structure and package setup
2. Build the Express API base and PostgreSQL connection
3. Build Task 1 dashboard against the API
4. Add Task 4 i18n and RTL to the dashboard
5. Build Task 5 billing page and Stripe backend flow
6. Build Task 2 Expo screen using the same API
7. Add Dockerfiles, Docker Compose, and `.env.example`
8. Write README and prepare the Loom walkthrough

## Loom Recording Plan

Keep the video under 5 minutes and cover:

1. Repo structure overview
2. Live dashboard auto-refresh
3. Language switching including Arabic RTL
4. Billing session start/end and returned PaymentIntent ID
5. Expo approve/reject flow
6. Brief Docker Compose explanation

## Submission Notes

- GitHub repo should be clean and easy to run
- README should include:
  - setup steps
  - env variables
  - Docker instructions
  - screenshots or short notes if helpful
- Use Stripe test keys only
- Prefer reliability and clarity over over-engineering

## Open Questions To Decide Before Coding

- Use plain npm workspaces or pnpm workspaces
- Whether the API will persist demo data in PostgreSQL or only validate connectivity
- Whether the mobile app should read from local dev API only or also support Docker-network access for testing

## Recommended Defaults

Unless we decide otherwise while building:

- package manager: `npm`
- real-time method: polling every 10 seconds
- i18n library: `react-i18next`
- backend framework: `Express`
- database access: lightweight Postgres client or Prisma only if needed
- styling: Tailwind in web, simple native styles in mobile
