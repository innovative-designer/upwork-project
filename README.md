# Upwork Shortlist Demo

This repository contains a small full-stack demo built to satisfy the five required shortlist tasks:

1. Next.js dashboard with live counters and Tailwind styling
2. Expo mobile screen with approve / reject flow
3. Docker Compose stack with Next.js, Express, and PostgreSQL
4. Multi-language switching with Arabic RTL support
5. Stripe metered billing flow with PaymentIntent creation

## Project Structure

```text
apps/
  api/      Express API + PostgreSQL bootstrap + Stripe endpoint
  web/      Next.js 14 + Tailwind + react-i18next dashboard and billing UI
  mobile/   Expo mobile app for the approve / reject task
documentation/
  upwork-shortlist-plan.md
docker-compose.yml
.env.example
```

## Prerequisites

- Node.js 20+
- npm 10+
- Docker Desktop for the Docker Compose task
- A Stripe test secret key for Task 5

Note: Expo SDK 55 prefers Node 20.19+ for the newest tooling. The app files are in place even if your local version is slightly older.

## Environment Setup

1. Copy `.env.example` to `.env`
2. Fill in `STRIPE_SECRET_KEY` with a Stripe test key

Important values:

- `API_BASE_URL=http://localhost:4000`
- `WEB_ORIGIN=http://localhost:3000`
- `EXPO_PUBLIC_API_URL=http://localhost:4000`

If you test the Expo app on a physical device, set `EXPO_PUBLIC_API_URL` to your machine's LAN IP, for example `http://192.168.1.25:4000`.

## Run Locally

Start the API:

```bash
cd apps/api
npm install
npm run dev
```

Start the web app:

```bash
cd apps/web
npm install
npm run dev
```

Start the mobile app:

```bash
cd apps/mobile
npm install
npm start
```

## Docker Compose

Once `.env` is in place, the Docker task is a single command:

```bash
docker compose up --build
```

Services:

- Web: `http://localhost:3000`
- API: `http://localhost:4000`
- PostgreSQL: `localhost:5432`

Implementation note:

- The browser talks to same-origin Next.js routes like `/api/metrics`
- The Next.js service proxies those requests to the Express API using Docker service networking
- The Express API connects to PostgreSQL and seeds the demo message data automatically

## Task Mapping

### Task 1

- Route: `/`
- Live counters update every 10 seconds from the Express API

### Task 2

- Expo `App.js`
- Messages are fetched from `GET /messages`
- Approve moves items into the handled section
- Reject removes them from the active list

### Task 3

- `docker-compose.yml`
- `apps/web/Dockerfile`
- `apps/api/Dockerfile`

### Task 4

- Language switcher in the web header
- Supported languages: English, Arabic, Spanish
- Arabic switches the page direction to RTL and persists via browser storage

### Task 5

- Route: `/billing`
- Start / End session UI updates every second
- Ending the session calls the API to create a Stripe test-mode PaymentIntent
- The returned PaymentIntent ID is shown on screen

## Stripe Note

The UI calculates cost at exactly `$0.02/second`.

Stripe test-mode card payments in USD have a minimum amount, so sessions shorter than 25 seconds may show:

- the actual calculated session total
- a slightly higher amount sent to Stripe

This is surfaced in the UI so the demo remains honest and still works reliably.

## Verification

Verified in this environment:

- `apps/api`: syntax check passed
- `apps/web`: `npm run lint` passed
- `apps/web`: `npm run build` passed
- `apps/mobile`: `npx expo-doctor` passed

Not verified here:

- `docker compose up` runtime, because Docker is not installed in this environment
- Live Stripe PaymentIntent creation, because a real Stripe test key was not available in this environment

## Loom Recording Outline

Keep the recording under 5 minutes:

1. Show repo structure
2. Demo the live dashboard auto-refresh
3. Switch between English, Spanish, and Arabic RTL
4. Run a billing session and show the PaymentIntent ID
5. Show the Expo approve / reject flow
6. Close with the Docker Compose files
