"use client";

import { useTranslations, useLocale } from "next-intl";

export function LocaleDebugger() {
  const locale = useLocale();
  const t = useTranslations("common");
  const tNav = useTranslations("nav");

  return (
    <div
      style={{
        position: "fixed",
        bottom: "10px",
        right: "10px",
        background: "rgba(0,0,0,0.8)",
        color: "white",
        padding: "10px",
        borderRadius: "5px",
        fontSize: "12px",
        zIndex: 9999,
      }}
    >
      <div>
        <strong>Locale:</strong> {locale}
      </div>
      <div>
        <strong>Welcome:</strong> {t("welcome")}
      </div>
      <div>
        <strong>Home:</strong> {tNav("home")}
      </div>
      <div>
        <strong>Properties:</strong> {tNav("properties")}
      </div>
    </div>
  );
}
