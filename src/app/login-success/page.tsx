"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

function LoginSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuthFromToken } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("Đang xử lý đăng nhập...");
  const [userInfo, setUserInfo] = useState<{
    name?: string;
    email?: string;
  } | null>(null);
  const hasRun = useRef(false); // Sử dụng useRef thay vì state

  useEffect(() => {
    // Tránh chạy lại nếu đã xử lý rồi
    if (hasRun.current) return;
    hasRun.current = true;

    const handleOAuthCallback = async () => {
      try {
        // Lấy data từ query params
        const encodedData = searchParams.get("data");

        if (!encodedData) {
          setStatus("error");
          setMessage("Không tìm thấy dữ liệu xác thực");
          return;
        }

        // Decode base64 data with proper UTF-8 handling
        let decodedData;
        try {
          // Decode URI component first
          const uriDecoded = decodeURIComponent(encodedData);
          
          // Use TextDecoder for proper UTF-8 decoding
          const binaryString = atob(uriDecoded);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          
          const utf8String = new TextDecoder('utf-8').decode(bytes);
          decodedData = JSON.parse(utf8String);
          
          console.log("Decoded OAuth data:", decodedData);
        } catch (decodeError) {
          console.error("Failed to decode data:", decodeError);
          setStatus("error");
          setMessage("Không thể giải mã dữ liệu xác thực");
          return;
        }

        const { accessToken, refreshToken, account, accountStatus } = decodedData;

        if (!accessToken || !account) {
          setStatus("error");
          setMessage("Dữ liệu xác thực không hợp lệ");
          return;
        }

        // Set user info for display
        setUserInfo({
          name: account.user.fullName || account.email?.split("@")[0],
          email: account.email,
        });

        // Transform API account to local User format (giống như login bình thường)
        const user = {
          id: account.user.id,
          email: account.email,
          fullName: account.user.fullName,
          avatarUrl: account.user.avatarUrl || "/assets/imgs/avatar.png",
          status: account.user.status,
          CCCD: account.user.CCCD || "",
          roles: account.roles || [],
        };

        // Store tokens and user data (giống như trong auth-context.tsx login function)
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        
        // Store full account info for profile and other pages (giữ nguyên cấu trúc như hiện tại)
        localStorage.setItem("account_info", JSON.stringify(account));
        
        // Import và sử dụng setCookie để lưu vào cookies
        const { setCookie } = await import("@/lib/utils/cookie-utils");
        
        setCookie("accessToken", accessToken, {
          expires: 1, // 1 day
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
        
        setCookie("refreshToken", refreshToken, {
          expires: 7, // 7 days
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });

        // Update auth state bằng cách gọi setAuthFromToken
        const result = await setAuthFromToken(accessToken);

        if (result.success) {
          setStatus("success");
          setMessage(
            `Đăng nhập thành công! ${
              accountStatus === "new"
                ? "Chào mừng bạn đến với TAKA Home!"
                : "Chào mừng bạn trở lại!"
            }`
          );

          // Show success toast chỉ một lần
          toast.success(
            "Đăng nhập thành công!",
            accountStatus === "new"
              ? "Chào mừng bạn đến với TAKA Home!"
              : "Chào mừng bạn trở lại!"
          );

          // Redirect sau 2 giây
          setTimeout(() => {
            const from = localStorage.getItem("oauth_redirect_url") || "/";
            localStorage.removeItem("oauth_redirect_url");
            router.push(from);
          }, 2000);
        } else {
          setStatus("error");
          setMessage(result.error || "Có lỗi xảy ra khi đăng nhập");
          toast.error(
            "Đăng nhập thất bại",
            result.error || "Có lỗi xảy ra khi đăng nhập"
          );
        }
      } catch (error) {
        console.error("OAuth callback error:", error);
        setStatus("error");
        setMessage("Có lỗi xảy ra khi xử lý đăng nhập");
        toast.error("Lỗi xử lý đăng nhập", "Có lỗi xảy ra khi xử lý đăng nhập");
      }
    };

    handleOAuthCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Chỉ chạy một lần khi component mount

  const handleRetry = () => {
    router.push("/signin");
  };

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md bg-[#FFF7E9] border-0 shadow-md">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            {status === "loading" && (
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
            )}
            {status === "success" && (
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
            )}
            {status === "error" && (
              <XCircle className="h-12 w-12 text-red-600 mx-auto" />
            )}
          </div>

          <h1 className="text-xl font-semibold mb-2">
            {status === "loading" && "Đang xử lý..."}
            {status === "success" && "Đăng nhập thành công!"}
            {status === "error" && "Đăng nhập thất bại"}
          </h1>

          <p className="text-gray-600 mb-6">{message}</p>

          {status === "success" && userInfo && (
            <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                <strong>Xin chào {userInfo.name}!</strong>
              </p>
              {userInfo.email && (
                <p className="text-xs text-green-600 mt-1">{userInfo.email}</p>
              )}
            </div>
          )}

          {status === "success" && (
            <div className="space-y-3">
              <p className="text-sm text-gray-500">
                Bạn sẽ được chuyển hướng trong giây lát...
              </p>
              <button
                onClick={() => {
                  const from =
                    localStorage.getItem("oauth_redirect_url") || "/";
                  localStorage.removeItem("oauth_redirect_url");
                  router.push(from);
                }}
                className="w-full bg-accent/90 text-white py-2 px-4 rounded-md hover:bg-accent/70 transition-colors"
              >
                Chuyển hướng ngay
              </button>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-3">
              <button
                onClick={handleRetry}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Thử lại
              </button>
              <button
                onClick={handleGoHome}
                className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
              >
                Về trang chủ
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <Card className="w-full max-w-md bg-[#FFF7E9] border-0 shadow-md">
            <CardContent className="p-8 text-center">
              <LoadingSpinner size="lg" text="Đang xử lý đăng nhập..." />
            </CardContent>
          </Card>
        </div>
      }
    >
      <LoginSuccessContent />
    </Suspense>
  );
}
