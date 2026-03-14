"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

import { LanguageSwitcher } from "@/components/language-switcher";

function NavLink({ href, label, active }) {
  return (
    <Link
      href={href}
      className={`rounded-[1.2rem] border px-4 py-4 text-sm font-semibold transition ${
        active
          ? "border-slate-900 bg-slate-900 text-amber-50 shadow-lg"
          : "border-slate-900/8 bg-white/82 text-slate-600 hover:border-slate-900/15 hover:bg-white hover:text-slate-900"
      }`}
    >
      {label}
    </Link>
  );
}

export function AppShell({ eyebrow, title, description, children }) {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <div className="soft-grid min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl flex-col rounded-[2rem] border border-white/70 bg-white/55 p-4 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6 lg:p-8">
        <header className="glass-panel fade-in-up rounded-[1.75rem] px-5 py-5 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                <span className="rounded-full border border-slate-900/10 bg-white/80 px-3 py-1 font-semibold uppercase tracking-[0.25em] text-slate-500">
                  {t("common.productTag")}
                </span>
                <span className="rounded-full bg-[rgba(8,126,139,0.12)] px-3 py-1 font-medium text-[color:var(--accent)]">
                  {t("common.liveBadge")}
                </span>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
                  {eyebrow}
                </p>
                <h1 className="heading-display max-w-3xl text-4xl text-slate-900 sm:text-5xl lg:text-[3.6rem]">
                  {title}
                </h1>
                <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                  {description}
                </p>
              </div>
            </div>

            <aside className="space-y-4">
              <div className="rounded-[1.45rem] bg-slate-900 p-5 text-white shadow-[0_18px_40px_rgba(15,23,42,0.22)]">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/60">
                  {t("common.controlCenter")}
                </p>
                <p className="mt-3 text-sm leading-6 text-white/80">
                  {t("common.controlCenterDescription")}
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-white/85">
                    {t("common.savedPreference")}
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-white/85">
                    {t("common.rtlReady")}
                  </span>
                </div>
              </div>

              <div className="rounded-[1.45rem] border border-slate-900/8 bg-white/72 p-4 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">
                    {t("common.viewMenu")}
                  </p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                    <NavLink
                      href="/"
                      label={t("navigation.dashboard")}
                      active={pathname === "/"}
                    />
                    <NavLink
                      href="/billing"
                      label={t("navigation.billing")}
                      active={pathname === "/billing"}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <LanguageSwitcher />
                </div>
              </div>
            </aside>
          </div>
        </header>

        <main className="mt-6 flex-1">{children}</main>
      </div>
    </div>
  );
}
