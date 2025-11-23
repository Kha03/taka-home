// src/app/[locale]/layout.tsx
import "../globals.css";
import {
  ThemeProvider,
  AuthProvider,
  SocketProvider,
} from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { i18n } from "../../../i18n.config";

export function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Await params in Next.js 15
  const { locale } = await params;

  // Validate locale
  if (!i18n.locales.includes(locale)) {
    notFound();
  }

  // Get messages for the locale
  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AuthProvider>
        <SocketProvider>
          <ThemeProvider>
            {children}
            <Toaster />
          </ThemeProvider>
        </SocketProvider>
      </AuthProvider>
    </NextIntlClientProvider>
  );
}
