/**
 * Wallet Balance Component
 * Hiển thị thông tin số dư ví
 */

"use client";

import { Wallet, RefreshCw } from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils/utils";

export interface WalletBalanceProps {
  showRefresh?: boolean;
  showTitle?: boolean;
  variant?: "card" | "inline" | "compact";
  className?: string;
}

export function WalletBalance({
  showRefresh = false,
  showTitle = true,
  variant = "card",
  className = "",
}: WalletBalanceProps) {
  const { wallet, loading, error, refetch, formatBalance } = useWallet({
    autoRefresh: true,
    refreshInterval: 60000, // 1 phút
  });

  if (loading && !wallet) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <RefreshCw className="h-4 w-4 animate-spin" />
        <span className="text-sm text-muted-foreground">Đang tải...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("flex items-center gap-2 text-red-500", className)}>
        <Wallet className="h-4 w-4" />
        <span className="text-sm">Lỗi tải ví</span>
        {showRefresh && (
          <Button variant="ghost" size="sm" onClick={refetch}>
            <RefreshCw className="h-3 w-3" />
          </Button>
        )}
      </div>
    );
  }

  if (!wallet) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 text-muted-foreground",
          className
        )}
      >
        <Wallet className="h-4 w-4" />
        <span className="text-sm">Chưa có thông tin ví</span>
      </div>
    );
  }

  // Compact variant for dropdown menu
  if (variant === "compact") {
    return (
      <div
        className={cn(
          "flex items-center gap-1 p-2 bg-green-50 rounded-md",
          className
        )}
      >
        <Wallet className="h-3 w-3 text-green-600" />
        <span className="text-xs font-medium text-green-700">
          Số dư: {formatBalance(wallet.availableBalance)}
        </span>
      </div>
    );
  }

  // Inline variant
  if (variant === "inline") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Wallet className="h-4 w-4 text-green-600" />
        <span className="font-medium">
          {formatBalance(wallet.availableBalance)}
        </span>
        {showRefresh && (
          <Button
            variant="ghost"
            size="sm"
            onClick={refetch}
            disabled={loading}
          >
            <RefreshCw className={cn("h-3 w-3", loading && "animate-spin")} />
          </Button>
        )}
      </div>
    );
  }

  // Card variant (default)
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
        {showTitle && (
          <CardTitle className="text-sm font-medium">Số dư ví</CardTitle>
        )}
        <Wallet className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-green-600">
          {formatBalance(wallet.availableBalance)}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Cập nhật lần cuối:{" "}
          {new Date(wallet.updatedAt).toLocaleString("vi-VN")}
        </p>
        {showRefresh && (
          <Button
            variant="outline"
            size="sm"
            className="mt-3 w-full text-primary"
            onClick={refetch}
            disabled={loading}
          >
            <RefreshCw
              className={cn("mr-2 h-4 w-4", loading && "animate-spin")}
            />
            Làm mới
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
