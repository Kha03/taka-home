"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Wallet } from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onPaymentSuccess: (method: string) => void;
}

export function PaymentModal({
  isOpen,
  onClose,
  amount,
  onPaymentSuccess,
}: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState("vnpay");
  const [isProcessing, setIsProcessing] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    // Call the payment success callback which will handle API call and redirect
    await onPaymentSuccess(selectedMethod);
    setIsProcessing(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Chọn Phương Thức Thanh Toán
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Amount Display */}
          <div className="rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
            <p className="text-sm font-medium opacity-90">Số tiền thanh toán</p>
            <p className="mt-2 text-3xl font-bold">{formatCurrency(amount)}</p>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3">
            <Label className="text-base font-semibold text-gray-900">
              Phương thức thanh toán
            </Label>
            <RadioGroup
              value={selectedMethod}
              onValueChange={setSelectedMethod}
            >
              {/* VNPay Option */}
              <div className="relative">
                <RadioGroupItem
                  value="vnpay"
                  id="vnpay"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="vnpay"
                  className="flex cursor-pointer items-center gap-4 rounded-lg border-2 border-gray-200 p-4 transition-all hover:border-blue-300 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                    <Wallet className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">VNPay</p>
                    <p className="text-sm text-gray-500">Ví điện tử VNPay</p>
                  </div>
                </Label>
              </div>

              {/* Credit Card Option */}
              <div className="relative">
                <RadioGroupItem
                  value="card"
                  id="card"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="card"
                  className="flex cursor-pointer items-center gap-4 rounded-lg border-2 border-gray-200 p-4 transition-all hover:border-blue-300 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                    <CreditCard className="h-6 w-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Wallet</p>
                    <p className="text-sm text-gray-500">
                      Sử dụng số dư trong ví
                    </p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-0 bg-accent hover:bg-accent/90"
              disabled={isProcessing}
            >
              Hủy
            </Button>
            <Button
              onClick={handlePayment}
              className="flex-1"
              disabled={isProcessing}
            >
              {isProcessing ? "Đang xử lý..." : "Xác Nhận Thanh Toán"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
