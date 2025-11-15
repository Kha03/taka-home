// src/app/[locale]/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Taka Home",
  description: "Project with shadcn/ui and dark mode support",
};

export function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
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
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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
      </body>
    </html>
  );
}
