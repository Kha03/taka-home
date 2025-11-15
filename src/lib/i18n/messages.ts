import { notFound } from "next/navigation";

export async function getMessages(locale: string) {
  try {
    return (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
}

export type Messages = {
  common: Record<string, string>;
  auth: Record<string, string>;
  nav: Record<string, string>;
  property: Record<string, string>;
  contract: Record<string, string>;
  payment: Record<string, string>;
  chat: Record<string, string>;
  notification: Record<string, string>;
  validation: Record<string, string>;
  footer: Record<string, string>;
};
