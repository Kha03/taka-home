import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import { i18n } from "../i18n.config";

export default getRequestConfig(async ({ locale }) => {
  // Validate locale
  const validatedLocale = locale || i18n.defaultLocale;

  if (!i18n.locales.includes(validatedLocale)) {
    notFound();
  }

  return {
    locale: validatedLocale,
    messages: (await import(`../messages/${validatedLocale}.json`)).default,
  };
});
