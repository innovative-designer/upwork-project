"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { AppShell } from "@/components/app-shell";

function formatCurrency(locale, amount) {
  return new Intl.NumberFormat(locale || "en", {
    style: "currency",
    currency: "USD"
  }).format(amount);
}

export function BillingView() {
  const { i18n, t } = useTranslation();
  const [startedAt, setStartedAt] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [sessionState, setSessionState] = useState("idle");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!startedAt || sessionState !== "running") {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      const nextElapsed = Math.max(
        1,
        Math.floor((Date.now() - startedAt.getTime()) / 1000)
      );
      setElapsedSeconds(nextElapsed);
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [startedAt, sessionState]);

  const runningCost = elapsedSeconds * 0.02;

  async function handleEndSession() {
    if (!startedAt) {
      return;
    }

    const endedAt = new Date();
    const secondsElapsed = Math.max(
      1,
      Math.round((endedAt.getTime() - startedAt.getTime()) / 1000)
    );

    setElapsedSeconds(secondsElapsed);
    setSessionState("submitting");
    setError("");

    try {
      const response = await fetch("/api/billing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          startedAt: startedAt.toISOString(),
          endedAt: endedAt.toISOString(),
          secondsElapsed
        })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || "Unable to create billing session.");
      }

      setResult(data);
      setSessionState("completed");
    } catch (requestError) {
      setError(requestError.message);
      setSessionState("completed");
    }
  }

  function handleStartSession() {
    const now = new Date();

    setStartedAt(now);
    setElapsedSeconds(0);
    setResult(null);
    setError("");
    setSessionState("running");
  }

  return (
    <AppShell
      eyebrow={t("billing.eyebrow")}
      title={t("billing.title")}
      description={t("billing.description")}
    >
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-panel fade-in-up rounded-[1.8rem] p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                {t("billing.sessionLabel")}
              </p>
              <h2 className="heading-display mt-3 text-3xl text-slate-900 sm:text-4xl">
                {t(`billing.states.${sessionState}`)}
              </h2>
            </div>
            <span className="rounded-full bg-[rgba(255,122,89,0.12)] px-4 py-2 text-sm font-semibold text-[color:var(--accent-warm)]">
              {t("billing.rate")}
            </span>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.4rem] border border-slate-900/8 bg-white/80 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                {t("billing.elapsed")}
              </p>
              <p className="mt-3 text-4xl font-bold text-slate-900">
                {elapsedSeconds}s
              </p>
            </div>
            <div className="rounded-[1.4rem] border border-slate-900/8 bg-white/80 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                {t("billing.runningCost")}
              </p>
              <p className="mt-3 text-4xl font-bold text-slate-900">
                {formatCurrency(i18n.resolvedLanguage, runningCost)}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleStartSession}
              disabled={sessionState === "running" || sessionState === "submitting"}
              className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-amber-50 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {t("billing.start")}
            </button>
            <button
              type="button"
              onClick={handleEndSession}
              disabled={!startedAt || sessionState !== "running"}
              className="rounded-full border border-slate-900/10 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {sessionState === "submitting" ? t("billing.processing") : t("billing.end")}
            </button>
          </div>

          <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-600">
            {t("billing.hint")}
          </p>

          {error ? (
            <div className="mt-6 rounded-[1.4rem] border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700">
              {error}
            </div>
          ) : null}
        </div>

        <aside className="glass-panel fade-in-up rounded-[1.8rem] p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            {t("billing.summary")}
          </p>
          <h2 className="heading-display mt-3 text-3xl text-slate-900">
            {t("billing.summaryHeading")}
          </h2>

          {result ? (
            <div className="mt-8 space-y-4">
              <div className="rounded-[1.4rem] border border-slate-900/8 bg-white/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  {t("billing.finalCost")}
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {formatCurrency(i18n.resolvedLanguage, result.actualTotalCents / 100)}
                </p>
              </div>
              <div className="rounded-[1.4rem] border border-slate-900/8 bg-white/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  {t("billing.paymentIntentId")}
                </p>
                <p className="mt-2 break-all text-sm font-semibold text-slate-900">
                  {result.paymentIntentId}
                </p>
              </div>
              <div className="rounded-[1.4rem] border border-slate-900/8 bg-white/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  {t("billing.chargedAmount")}
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-900">
                  {formatCurrency(i18n.resolvedLanguage, result.chargedTotalCents / 100)}
                </p>
                {result.minimumApplied ? (
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {t("billing.minimumApplied")}
                  </p>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="mt-8 rounded-[1.4rem] border border-dashed border-slate-300 bg-white/65 p-6 text-sm leading-7 text-slate-600">
              {t("billing.emptyState")}
            </div>
          )}
        </aside>
      </section>
    </AppShell>
  );
}
