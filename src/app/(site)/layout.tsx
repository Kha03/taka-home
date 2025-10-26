// src/app/(site)/layout.tsx
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Chatbot } from "@/components/chatbot";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <Chatbot />
    </div>
  );
}
