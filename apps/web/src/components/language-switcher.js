"use client";

import { useTransition } from "react";
import { useTranslation } from "react-i18next";

const languages = [
  { code: "en", labelKey: "common.languages.en", short: "EN" },
  { code: "ar", labelKey: "common.languages.ar", short: "AR" },
  { code: "es", labelKey: "common.languages.es", short: "ES" }
];

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const [isPending, startTransition] = useTransition();

  return (
    <section className="rounded-[1.2rem] border border-slate-900/8 bg-white/80 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            {t("common.language")}
          </p>
          <p className="mt-1 text-sm text-slate-500">{t("common.languageHint")}</p>
        </div>
        <span className="rounded-full bg-[rgba(8,126,139,0.12)] px-3 py-1 text-xs font-semibold text-[color:var(--accent)]">
          {t("common.savedPreference")}
        </span>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
        {languages.map((language) => {
          const active = i18n.resolvedLanguage === language.code;

          return (
            <button
              key={language.code}
              type="button"
              onClick={() =>
                startTransition(() => {
                  i18n.changeLanguage(language.code);
                })
              }
              className={`flex items-center justify-between rounded-[1rem] border px-4 py-3 text-sm font-semibold transition ${
                active
                  ? "border-slate-900 bg-slate-900 text-amber-50 shadow-lg"
                  : "border-slate-900/8 bg-white text-slate-600 hover:border-slate-900/15 hover:bg-slate-50 hover:text-slate-900"
              } ${isPending ? "opacity-80" : ""}`}
            >
              <span>{t(language.labelKey)}</span>
              <span
                className={`rounded-full px-2 py-1 text-[11px] font-bold tracking-[0.16em] ${
                  active ? "bg-white/15 text-amber-50" : "bg-slate-100 text-slate-500"
                }`}
              >
                {language.short}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
