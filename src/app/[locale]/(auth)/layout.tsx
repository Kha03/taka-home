// src/app/[locale]/(auth)/layout.tsx
import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";

export const metadata = {
  title: "Auth",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="h-screen bg-primary-foreground overflow-hidden">
      <div className="grid h-screen lg:grid-cols-2">
        <div className="relative hidden lg:block">
          <Image
            src="/assets/imgs/illustrate-auth.jpg"
            alt="Real estate illustration"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        {/* Khu form */}
        <div className="flex h-screen overflow-y-auto">
          <div className="flex w-full items-start justify-center p-3 py-4 sm:p-6 sm:items-center">
            <div className="w-full max-w-md">
              {/* Logo chung */}
              <div className="mb-3 text-center sm:mb-4">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center"
                >
                  <Image
                    src="/assets/logos/logoHome.svg"
                    alt="Taka Home"
                    width={120}
                    height={40}
                    className="mx-auto"
                  />
                </Link>
              </div>

              <div className="rounded-2xl border p-3 shadow-sm sm:p-5 bg-primary-foreground">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
