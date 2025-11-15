import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/lib/i18n/navigation";
import { i18n } from "../../i18n.config";

export function useI18n() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  // Change language
  const changeLanguage = (newLocale: string) => {
    if (!i18n.locales.includes(newLocale)) {
      console.error(`Locale ${newLocale} is not supported`);
      return;
    }

    // Use next-intl router which handles locale automatically
    router.replace(pathname, { locale: newLocale });
  };

  return {
    locale,
    changeLanguage,
    locales: i18n.locales,
    defaultLocale: i18n.defaultLocale,
  };
}
