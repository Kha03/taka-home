"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";
import { auth } from "@/lib/auth/firebase";
import { Phone, Mail, ArrowLeft } from "lucide-react";

type RecoveryMethod = "phone" | "email";
type Step = "select-method" | "enter-contact" | "verify-otp" | "reset-password";

export function ForgotPasswordForm() {
  const [method, setMethod] = useState<RecoveryMethod>("phone");
  const [step, setStep] = useState<Step>("select-method");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] =
    useState<RecaptchaVerifier | null>(null);

  // Initialize RecaptchaVerifier
  const initRecaptcha = () => {
    if (!recaptchaVerifier) {
      const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => {
          // reCAPTCHA solved
        },
      });
      setRecaptchaVerifier(verifier);
      return verifier;
    }
    return recaptchaVerifier;
  };

  // Step 1: Send OTP
  const handleSendOTP = async () => {
    setError("");
    setSuccess("");

    if (method === "phone") {
      // Validate phone number
      if (!phoneNumber.trim()) {
        setError("Vui lòng nhập số điện thoại");
        return;
      }

      // Format phone number to E.164 format
      let formattedPhone = phoneNumber.trim();
      if (!formattedPhone.startsWith("+84")) {
        if (formattedPhone.startsWith("0")) {
          formattedPhone = "+84" + formattedPhone.substring(1);
        } else {
          formattedPhone = "+84" + formattedPhone;
        }
      }

      setIsLoading(true);

      try {
        const verifier = initRecaptcha();
        const confirmation = await signInWithPhoneNumber(
          auth,
          formattedPhone,
          verifier
        );
        setConfirmationResult(confirmation);
        setSuccess("Mã OTP đã được gửi đến số điện thoại của bạn");
        setStep("verify-otp");
      } catch (err: unknown) {
        console.error("Error sending OTP:", err);
        
        // Handle specific Firebase errors
        const error = err as { code?: string; message?: string };
        if (error.code === "auth/invalid-phone-number") {
          setError("Số điện thoại không hợp lệ");
        } else if (error.code === "auth/too-many-requests") {
          setError("Quá nhiều yêu cầu. Vui lòng thử lại sau");
        } else if (error.code === "auth/quota-exceeded") {
          setError("Đã vượt quá giới hạn gửi SMS. Vui lòng thử lại sau");
        } else {
          setError(error.message || "Không thể gửi mã OTP. Vui lòng thử lại");
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      // TODO: Handle email recovery
      setError("Tính năng khôi phục qua email đang được phát triển");
    }
  };

  // Step 2: Verify OTP and get idToken
  const handleVerifyOTP = async () => {
    setError("");
    setSuccess("");

    if (!otp.trim()) {
      setError("Vui lòng nhập mã OTP");
      return;
    }

    if (!newPassword.trim() || !confirmPassword.trim()) {
      setError("Vui lòng nhập mật khẩu mới");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    if (newPassword.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (!confirmationResult) {
      setError("Vui lòng gửi lại mã OTP");
      return;
    }

    setIsLoading(true);

    try {
      // Verify OTP
      const userCredential = await confirmationResult.confirm(otp);
      
      // Get idToken
      const idToken = await userCredential.user.getIdToken();

      // Send idToken and newPassword to backend to reset password
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idToken,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      setSuccess("Đổi mật khẩu thành công! Đang chuyển hướng...");
      
      // Redirect to signin page after 2 seconds
      setTimeout(() => {
        window.location.href = "/signin";
      }, 2000);

    } catch (err: unknown) {
      console.error("Error verifying OTP:", err);
      
      const error = err as { code?: string; message?: string };
      if (error.code === "auth/invalid-verification-code") {
        setError("Mã OTP không chính xác");
      } else if (error.code === "auth/code-expired") {
        setError("Mã OTP đã hết hạn. Vui lòng gửi lại");
      } else {
        setError(error.message || "Xác thực thất bại. Vui lòng thử lại");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setError("");
    setSuccess("");
    if (step === "verify-otp") {
      setStep("enter-contact");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
    } else if (step === "enter-contact") {
      setStep("select-method");
      setPhoneNumber("");
      setEmail("");
    }
  };

  return (
    <div className="space-y-4">
      {/* Recaptcha container */}
      <div id="recaptcha-container"></div>

      {error && (
        <div className="p-2.5 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="p-2.5 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
          {success}
        </div>
      )}

      {/* Step 1: Select Recovery Method */}
      {step === "select-method" && (
        <div className="space-y-4">
          <div className="space-y-3">
            <Label>Chọn phương thức khôi phục</Label>
            <RadioGroup
              value={method}
              onValueChange={(value) => setMethod(value as RecoveryMethod)}
            >
              <Card className="p-4 cursor-pointer bg-white hover:border-primary transition-colors">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="phone" id="phone" />
                  <Label
                    htmlFor="phone"
                    className="flex items-center cursor-pointer flex-1"
                  >
                    <Phone className="w-5 h-5 mr-2 text-primary" />
                    <div>
                      <div className="font-medium">Số điện thoại</div>
                      <div className="text-xs text-muted-foreground">
                        Nhận mã OTP qua SMS
                      </div>
                    </div>
                  </Label>
                </div>
              </Card>

              <Card className="p-4 cursor-pointer bg-white hover:border-primary transition-colors opacity-50">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="email" id="email" disabled />
                  <Label
                    htmlFor="email"
                    className="flex items-center cursor-pointer flex-1"
                  >
                    <Mail className="w-5 h-5 mr-2 text-primary" />
                    <div>
                      <div className="font-medium">Email</div>
                      <div className="text-xs text-muted-foreground">
                        Nhận link khôi phục qua email (Sắp ra mắt)
                      </div>
                    </div>
                  </Label>
                </div>
              </Card>
            </RadioGroup>
          </div>

          <Button
            className="w-full"
            onClick={() => setStep("enter-contact")}
            disabled={!method}
          >
            Tiếp tục
          </Button>

          <div className="text-center">
            <Link
              href="/signin"
              className="text-sm text-primary hover:underline inline-flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Quay lại đăng nhập
            </Link>
          </div>
        </div>
      )}

      {/* Step 2: Enter Contact Information */}
      {step === "enter-contact" && (
        <div className="space-y-4">
          {method === "phone" ? (
            <div className="space-y-1.5">
              <Label htmlFor="phone-input">Số điện thoại</Label>
              <Input
                id="phone-input"
                type="tel"
                placeholder="0912345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Nhập số điện thoại đã đăng ký với tài khoản
              </p>
            </div>
          ) : (
            <div className="space-y-1.5">
              <Label htmlFor="email-input">Email</Label>
              <Input
                id="email-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Nhập email đã đăng ký với tài khoản
              </p>
            </div>
          )}

          <Button
            className="w-full"
            onClick={handleSendOTP}
            disabled={isLoading}
          >
            {isLoading ? "Đang gửi..." : "Gửi mã xác thực"}
          </Button>

          <div className="text-center">
            <button
              onClick={handleBack}
              className="text-sm text-primary hover:underline inline-flex items-center"
              disabled={isLoading}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Quay lại
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Verify OTP and Enter New Password */}
      {step === "verify-otp" && (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="otp-input">Mã OTP</Label>
            <Input
              id="otp-input"
              type="text"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Nhập mã OTP được gửi đến số điện thoại của bạn
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="new-password">Mật khẩu mới</Label>
            <Input
              id="new-password"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirm-password">Xác nhận mật khẩu</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <Button
            className="w-full"
            onClick={handleVerifyOTP}
            disabled={isLoading}
          >
            {isLoading ? "Đang xác thực..." : "Xác nhận và đổi mật khẩu"}
          </Button>

          <div className="text-center space-y-2">
            <button
              onClick={handleSendOTP}
              className="text-sm text-primary hover:underline block w-full"
              disabled={isLoading}
            >
              Gửi lại mã OTP
            </button>
            <button
              onClick={handleBack}
              className="text-sm text-primary hover:underline inline-flex items-center"
              disabled={isLoading}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Quay lại
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
