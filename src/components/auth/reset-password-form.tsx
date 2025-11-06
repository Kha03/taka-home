"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/lib/api/services/auth";
import { ArrowLeft, CheckCircle2, XCircle, Loader2 } from "lucide-react";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

  // Verify token khi component mount
  useEffect(() => {
    if (!token) {
      setError("Link không hợp lệ hoặc thiếu token");
      setIsValidToken(false);
      setIsVerifying(false);
      return;
    }

    const verifyToken = async () => {
      setIsVerifying(true);

      try {
        // Decode JWT để check expiry (không cần gọi API)
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );

        const decoded = JSON.parse(jsonPayload);
        
        // Check expiry
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp < currentTime) {
          setError("Link đã hết hạn. Vui lòng yêu cầu gửi lại email khôi phục.");
          setIsValidToken(false);
        } else {
          setIsValidToken(true);
        }
      } catch (err) {
        console.error("Error verifying token:", err);
        setError("Token không hợp lệ. Vui lòng kiểm tra lại link trong email.");
        setIsValidToken(false);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("Link không hợp lệ");
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

    setIsLoading(true);

    try {
      const response = await authService.resetPasswordWithEmail({
        token,
        newPassword,
      });

      // Backend response format:
      // Success: { code: 200, message: "SUCCESS", data: { message: "Đặt lại mật khẩu thành công!" } }
      // Error: { message: "Token không hợp lệ...", error: "Unauthorized", statusCode: 401 }

      if (response.code !== 200) {
        throw new Error(response.message || "Đặt lại mật khẩu thất bại");
      }

      const successMessage = response.data?.message || "Đặt lại mật khẩu thành công!";
      setSuccess(`${successMessage} Đang chuyển hướng đến trang đăng nhập...`);

      setTimeout(() => {
        router.push("/signin");
      }, 2000);
    } catch (err: unknown) {
      console.error("Reset password error:", err);

      const error = err as { 
        message?: string; 
        status?: number;
        statusCode?: number;
        error?: string;
      };

      // Handle backend error format
      if (error.statusCode === 401 || error.status === 401) {
        setError(
          error.message || 
          "Token không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu reset mật khẩu lại."
        );
      } else if (error.status === 400 || error.statusCode === 400) {
        setError("Link đã hết hạn hoặc đã được sử dụng. Vui lòng yêu cầu gửi lại email.");
      } else if (error.status === 404 || error.statusCode === 404) {
        setError("Không tìm thấy yêu cầu đặt lại mật khẩu");
      } else {
        setError(error.message || "Không thể đặt lại mật khẩu. Vui lòng thử lại");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state khi đang verify token
  if (isVerifying) {
    return (
      <div className="space-y-4 text-center py-8">
        <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />
        <p className="text-muted-foreground">Đang xác thực link...</p>
      </div>
    );
  }

  // Token không hợp lệ hoặc hết hạn
  if (isValidToken === false) {
    return (
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium mb-1">Link không hợp lệ</p>
            <p className="text-red-600/80">
              {error || "Link không hợp lệ hoặc đã hết hạn (1 giờ). Vui lòng yêu cầu gửi lại email khôi phục."}
            </p>
          </div>
        </div>

        <Button
          className="w-full"
          onClick={() => router.push("/forgot-password")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Gửi lại email khôi phục
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
    );
  }

  // Form đặt lại mật khẩu
  return (
    <form onSubmit={handleResetPassword} className="space-y-4">
      {error && (
        <div className="flex items-start gap-3 p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="flex-1">{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 p-4 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="flex-1">{success}</p>
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="new-password">Mật khẩu mới</Label>
        <Input
          id="new-password"
          type="password"
          placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={isLoading}
          required
          autoFocus
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirm-password">Xác nhận mật khẩu</Label>
        <Input
          id="confirm-password"
          type="password"
          placeholder="Nhập lại mật khẩu mới"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Đang xử lý...
          </>
        ) : (
          "Đặt lại mật khẩu"
        )}
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
    </form>
  );
}

export function ResetPasswordForm() {
  return (
    <Suspense
      fallback={
        <div className="space-y-4 text-center py-8">
          <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
