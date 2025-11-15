import { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Đặt lại mật khẩu | Taka Home",
  description: "Đặt lại mật khẩu tài khoản Taka Home của bạn",
};

export default function ResetPasswordPage() {
  return (
    <>
      <div className="mb-6 space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-primary">
          Đặt lại mật khẩu
        </h1>
        <p className="text-muted-foreground">
          Nhập mật khẩu mới cho tài khoản của bạn
        </p>
      </div>
      <ResetPasswordForm />
    </>
  );
}
