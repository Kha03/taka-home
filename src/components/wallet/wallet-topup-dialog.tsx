/**
 * Wallet Topup Dialog Component
 * Dialog để nạp tiền vào ví qua VNPAY
 */

"use client";

import { useState } from "react";
import { Wallet, RefreshCw, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils/utils";
import { paymentService, PaymentPurpose } from "@/lib/api/services/payment";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";

export interface WalletTopupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function WalletTopupDialog({
  open,
  onOpenChange,
  onSuccess,
}: WalletTopupDialogProps) {
  const t = useTranslations("wallet");
  const [topupAmount, setTopupAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Các mức nạp tiền gợi ý
  const suggestedAmounts = [
    200000, 500000, 1000000, 2000000, 5000000, 10000000,
  ];

  // Format số tiền khi nhập
  const formatInputCurrency = (value: string) => {
    const numValue = parseFloat(value.replace(/[^0-9]/g, ""));
    if (isNaN(numValue)) return "";
    return new Intl.NumberFormat("vi-VN").format(numValue);
  };

  const handleAmountChange = (value: string) => {
    const numValue = value.replace(/[^0-9]/g, "");
    setTopupAmount(numValue);
  };

  // Reset form khi đóng dialog
  const handleClose = () => {
    setTopupAmount("");
    setIsProcessing(false);
    onOpenChange(false);
  };

  // Xử lý nạp tiền
  const handleTopup = async () => {
    const amount = parseFloat(topupAmount);

    // Validation
    if (!amount || amount <= 0) {
      toast.error(t("error"), t("enterValidAmount"));
      return;
    }

    if (amount < 10000) {
      toast.error(t("error"), t("minimumAmount"));
      return;
    }

    if (amount > 50000000) {
      toast.error(t("error"), t("maximumAmount"));
      return;
    }

    setIsProcessing(true);

    try {
      const response = await paymentService.createPayment({
        amount: amount,
        method: "VNPAY",
        purpose: PaymentPurpose.WALLET_TOPUP,
      });

      if (response.code === 200 && response.data) {
        const { paymentUrl } = response.data;

        // Gọi callback success nếu có
        onSuccess?.();

        // Đóng dialog
        handleClose();

        // Hiển thị thông báo
        toast.success(
          "Chuyển hướng thanh toán",
          "Đang chuyển đến cổng thanh toán VNPAY..."
        );

        // Chuyển hướng đến trang thanh toán VNPAY
        window.location.href = paymentUrl;
      } else {
        toast.error("Lỗi", "Không thể tạo yêu cầu thanh toán");
      }
    } catch {
      toast.error("Lỗi", "Đã xảy ra lỗi khi xử lý thanh toán");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("topupTitle")}</DialogTitle>
          <DialogDescription className="flex flex-col items-center">
            {t("topupDescription")}
            <Image
              src="/assets/logos/VNPAY.svg"
              alt="VNPAY Logo"
              width={100}
              height={30}
              className="inline-block ml-2 mb-1"
            />
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Input số tiền */}
          <div className="space-y-2">
            <Label htmlFor="amount">{t("amount")} (VND)</Label>
            <Input
              id="amount"
              placeholder={t("enterAmount")}
              value={formatInputCurrency(topupAmount)}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="text-lg font-semibold"
            />
            <p className="text-xs text-gray-500">{t("amountRange")}</p>
          </div>

          {/* Các mức tiền gợi ý */}
          <div className="space-y-2">
            <Label>{t("quickSelect")}</Label>
            <div className="grid grid-cols-3 gap-2">
              {suggestedAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setTopupAmount(amount.toString())}
                  className={cn(
                    "text-sm text-primary",
                    topupAmount === amount.toString() &&
                      "border-[#DCBB87] bg-[#DCBB87]/10 text-[#DCBB87]"
                  )}
                >
                  {new Intl.NumberFormat("vi-VN", {
                    notation: "compact",
                    compactDisplay: "short",
                  }).format(amount)}
                </Button>
              ))}
            </div>
          </div>

          {/* Thông tin thanh toán */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>{t("note")}:</strong> {t("paymentNote")}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isProcessing}
            className="text-red-500 border-red-500"
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={handleTopup}
            disabled={!topupAmount || isProcessing}
            className="bg-[#DCBB87] hover:bg-[#B8935A]"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                {t("processing")}
              </>
            ) : (
              <>
                <Wallet className="mr-2 h-4 w-4" />
                {t("topup")}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Export trigger button component for convenience
export interface WalletTopupTriggerProps {
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  children?: React.ReactNode;
}

export function WalletTopupTrigger({
  className,
  variant = "default",
  size = "sm",
  children,
}: WalletTopupTriggerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={cn("bg-[#DCBB87] hover:bg-[#B8935A]", className)}
        onClick={() => setOpen(true)}
      >
        {children || (
          <>
            <Plus className="mr-2 h-4 w-4" />
            Nạp tiền
          </>
        )}
      </Button>
      <WalletTopupDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
