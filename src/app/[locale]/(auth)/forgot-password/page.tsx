import { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Quên mật khẩu | Taka Home",
  description: "Khôi phục mật khẩu tài khoản Taka Home của bạn",
};

export default function ForgotPasswordPage() {
  return (
    <>
      <div className="mb-6 space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-primary">
          Quên mật khẩu?
        </h1>
        <p className="text-muted-foreground">
          Chọn phương thức để khôi phục mật khẩu của bạn
        </p>
      </div>
      <ForgotPasswordForm />
    </>
  );
}
