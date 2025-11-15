import { Metadata } from "next";
import { SignInForm } from "@/components/auth/signin-form";

export const metadata: Metadata = {
  title: "Đăng nhập | Taka Home",
  description: "Đăng nhập vào tài khoản Taka Home của bạn",
};

type SignInPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;

  return (
    <>
      <div className="mb-6 space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-primary">
          Chào mừng trở lại
        </h1>
        <p className="text-muted-foreground">Vui lòng đăng nhập để tiếp tục</p>
      </div>
      <SignInForm errorFromUrl={params.error} />
    </>
  );
}
