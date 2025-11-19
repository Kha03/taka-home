"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  paymentService,
  PaymentPurpose,
  type CreatePaymentDto,
} from "@/lib/api/services/payment";
import { ContractExtension } from "@/types/contracts";
import { Wallet, CreditCard, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { translateError } from "@/lib/constants/error-messages";

interface ExtensionEscrowDepositDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  extension: ContractExtension;
  userRole: string;
  depositAmount: number; // Số tiền cọc cần đặt
  onSuccess: () => void;
}

export function ExtensionEscrowDepositDialog({
  open,
  onOpenChange,
  extension,
  userRole,
  depositAmount,
  onSuccess,
}: ExtensionEscrowDepositDialogProps) {
  const [selectedMethod, setSelectedMethod] = useState<"VNPAY" | "WALLET">(
    "VNPAY"
  );
  const [isProcessing, setIsProcessing] = useState(false);

  // Dùng số tiền cọc mặc định 100,000 nếu không có
  const finalDepositAmount = depositAmount || 100000;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const handleDeposit = async () => {
    setIsProcessing(true);
    try {
      const purpose: PaymentPurpose =
        userRole === "TENANT"
          ? PaymentPurpose.TENANT_EXTENSION_ESCROW_DEPOSIT
          : PaymentPurpose.LANDLORD_EXTENSION_ESCROW_DEPOSIT;

      const paymentDto: CreatePaymentDto = {
        contractId: extension.contractId,
        amount: finalDepositAmount,
        method: selectedMethod,
        purpose: purpose,
      };

      const response = await paymentService.createPayment(paymentDto);

      if (response.code === 200 && response.data) {
        toast.success("Thành công", "Đang chuyển đến trang thanh toán...");

        // Redirect to payment URL
        if (response.data.paymentUrl) {
          window.location.href = response.data.paymentUrl;
        } else {
          // Nếu thanh toán bằng ví, refresh để cập nhật status
          toast.success("Thành công", "Đã thanh toán bằng ví");
          onOpenChange(false);
          onSuccess();
        }
      }
    } catch (err) {
      console.error("Payment error:", err);
      const errorMessage = translateError(
        err,
        "Không thể tạo thanh toán. Vui lòng thử lại"
      );
      toast.error("Lỗi", errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Đặt Cọc Gia Hạn
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-3">
          {/* Amount Display */}
          <div className="rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white">
            <p className="text-xs font-medium opacity-90">Số tiền cọc</p>
            <p className="mt-1 text-2xl font-bold">
              {formatCurrency(finalDepositAmount)}
            </p>
            <div className="mt-2 flex items-center gap-2 text-xs opacity-80">
              <span>ID:</span>
              <span className="font-mono">
                {extension.contractId.slice(0, 8)}...
              </span>
            </div>
          </div>

          {/* Extension Info */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-gray-500">Số tháng gia hạn</p>
                <p className="font-semibold text-gray-900">
                  {extension.extensionMonths} tháng
                </p>
              </div>
              <div>
                <p className="text-gray-500">Vai trò</p>
                <p className="font-semibold text-gray-900">
                  {userRole === "TENANT" ? "Người thuê" : "Chủ nhà"}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-900">
              Phương thức thanh toán
            </Label>
            <RadioGroup
              value={selectedMethod}
              onValueChange={(value) =>
                setSelectedMethod(value as "VNPAY" | "WALLET")
              }
            >
              {/* VNPay Option */}
              <div className="relative">
                <RadioGroupItem
                  value="VNPAY"
                  id="vnpay-escrow"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="vnpay-escrow"
                  className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-gray-200 p-3 transition-all hover:border-blue-300 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                    <Wallet className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">VNPay</p>
                    <p className="text-xs text-gray-500">Ví điện tử VNPay</p>
                  </div>
                </Label>
              </div>

              {/* Wallet Option */}
              <div className="relative">
                <RadioGroupItem
                  value="WALLET"
                  id="wallet-escrow"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="wallet-escrow"
                  className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-gray-200 p-3 transition-all hover:border-blue-300 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                    <CreditCard className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      Wallet
                    </p>
                    <p className="text-xs text-gray-500">
                      Sử dụng số dư trong ví
                    </p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
            <AlertTriangle className="h-4 w-4 flex-shrink-0 text-amber-600" />
            <p className="text-xs text-amber-800">
              {userRole === "TENANT"
                ? "Số tiền cọc sẽ được giữ trong ký quỹ và hoàn trả khi kết thúc hợp đồng."
                : "Số tiền cọc sẽ được giữ để đảm bảo cam kết cho thuê."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-1">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-0 bg-accent hover:bg-accent/90"
              disabled={isProcessing}
            >
              Hủy
            </Button>
            <Button
              onClick={handleDeposit}
              className="flex-1"
              disabled={isProcessing}
            >
              {isProcessing ? "Đang xử lý..." : "Xác Nhận"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
