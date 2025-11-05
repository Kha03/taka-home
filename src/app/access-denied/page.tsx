"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";

export default function AccessDeniedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <div className="mx-auto w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center">
            <ShieldAlert className="h-12 w-12 text-destructive" />
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">
              Truy cập bị từ chối
            </h1>
            <p className="text-xl text-muted-foreground">403 - Forbidden</p>
          </div>

          <p className="text-muted-foreground">
            Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị
            viên nếu bạn cho rằng đây là lỗi.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="gap-2 text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
          <Button onClick={() => router.push("/")} className="gap-2">
            <Home className="h-4 w-4" />
            Về trang chủ
          </Button>
        </div>

        <div className="pt-6 border-t">
          <p className="text-xs text-muted-foreground">
            Nếu bạn cần trợ giúp, vui lòng liên hệ bộ phận hỗ trợ
          </p>
        </div>
      </div>
    </div>
  );
}
