// src/app/(auth)/layout.tsx
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Auth",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-primary-foreground">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="relative hidden lg:block">
          <Image
            src="/assets/imgs/illustrate-auth.jpg"
            alt="Real estate illustration"
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Khu form */}
        <div className="flex">
          <div className="flex w-full items-center justify-center p-6 sm:p-8">
            <div className="w-full max-w-xl my-8">
              {/* Logo chung */}
              <div className="mb-6 text-center">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center"
                >
                  <Image
                    src="/assets/logos/logoHome.svg"
                    alt="Taka Home"
                    width={150}
                    height={50}
                    className="mx-auto"
                  />
                </Link>
              </div>

              <div className="rounded-2xl border p-4 shadow-sm sm:p-6 bg-primary-foreground">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
