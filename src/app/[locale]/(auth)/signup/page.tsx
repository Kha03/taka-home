import { Metadata } from "next";
import { SignUpForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Đăng ký | Taka Home",
  description: "Tạo tài khoản Taka Home mới",
};

export default function SignUpPage() {
  return (
    <>
      <div className="mb-6 space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-primary">
          Tạo tài khoản mới
        </h1>
        <p className="text-muted-foreground">
          Điền thông tin của bạn để bắt đầu
        </p>
      </div>
      <SignUpForm />
    </>
  );
}
