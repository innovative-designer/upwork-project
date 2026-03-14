"use client";

import { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";

import i18n, { rtlLanguages } from "@/lib/i18n";

function applyDocumentLanguage(language) {
  const nextLanguage = language || "en";
  const isRtl = rtlLanguages.includes(nextLanguage);

  document.documentElement.lang = nextLanguage;
  document.documentElement.dir = isRtl ? "rtl" : "ltr";
}

export function AppProviders({ children }) {
  const [ready, setReady] = useState(i18n.isInitialized);

  useEffect(() => {
    const syncLanguage = (language) => {
      applyDocumentLanguage(language || i18n.resolvedLanguage || i18n.language);
      setReady(true);
    };

    syncLanguage();
    i18n.on("initialized", syncLanguage);
    i18n.on("languageChanged", syncLanguage);

    return () => {
      i18n.off("initialized", syncLanguage);
      i18n.off("languageChanged", syncLanguage);
    };
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      {ready ? (
        children
      ) : (
        <div className="soft-grid flex min-h-screen items-center justify-center px-6">
          <div className="glass-panel fade-in-up w-full max-w-md rounded-[2rem] p-8 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
              Loading demo shell
            </p>
            <h1 className="heading-display mt-4 text-4xl text-slate-900">
              Preparing the dashboard
            </h1>
          </div>
        </div>
      )}
    </I18nextProvider>
  );
}
