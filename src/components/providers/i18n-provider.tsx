import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "@/lib/i18n/messages";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  locale: string;
};

export async function I18nProvider({ children, locale }: Props) {
  const messages = await getMessages(locale);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
