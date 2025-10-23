"use client";

import { useEffect, useState, useCallback } from "react";
import { Wallet, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  contractService,
  type EscrowBalanceResponse,
} from "@/lib/api/services/contract";
import { paymentService, PaymentPurpose } from "@/lib/api/services/payment";
import { PaymentModal } from "@/components/payment/payment-modal";
import { toast } from "sonner";

interface EscrowBalanceDetailCardProps {
  contractId: string;
  requiredDeposit: number;
  userRole: string;
  onRefresh?: () => void;
}

export function EscrowBalanceDetailCard({
  contractId,
  requiredDeposit,
  userRole,
  onRefresh,
}: EscrowBalanceDetailCardProps) {
  const [balance, setBalance] = useState<EscrowBalanceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [shortageAmount, setShortageAmount] = useState(0);

  const fetchBalance = useCallback(async () => {
    try {
      setLoading(true);
      const response = await contractService.getEscrowByContractId(contractId);
      if (response.code === 200 && response.data) {
        setBalance(response.data);
      }
    } catch (err) {
      console.error("Error fetching escrow balance:", err);
      toast.error("Không thể tải thông tin số dư cọc");
    } finally {
      setLoading(false);
    }
  }, [contractId]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("vi-VN").format(num) + " đ";
  };

  const handleTopUpDeposit = (shortage: number) => {
    setShortageAmount(shortage);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (method: "VNPAY" | "WALLET") => {
    try {
      const purpose =
        userRole === "TENANT"
          ? PaymentPurpose.TENANT_ESCROW_DEPOSIT
          : PaymentPurpose.LANDLORD_ESCROW_DEPOSIT;

      const response = await paymentService.createPayment({
        contractId,
        amount: shortageAmount,
        method,
        purpose,
      });

      if (method === "WALLET") {
        if (response.data?.status === "PAID") {
          toast.success("Nộp thêm tiền cọc thành công!");
          await fetchBalance();
          onRefresh?.();
        } else {
          toast.error("Thanh toán thất bại. Vui lòng kiểm tra số dư ví");
        }
      } else {
        if (response.data?.paymentUrl) {
          toast.success("Đang chuyển đến trang thanh toán...");
          window.location.href = response.data.paymentUrl;
        } else {
          toast.error("Không thể tạo thanh toán");
        }
      }

      setShowPaymentModal(false);
    } catch (error) {
      console.error(error);
      toast.error("Không thể tạo thanh toán. Vui lòng thử lại");
    }
  };

  if (loading) {
    return (
      <Card className="bg-primary-foreground shadow-sm rounded-2xl border-none">
        <CardContent className="py-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Wallet className="w-4 h-4 animate-pulse" />
            <span>Đang tải số dư cọc...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!balance) return null;

  const tenantBalance = parseFloat(balance.balanceTenant);
  const landlordBalance = parseFloat(balance.balanceLandlord);
  const tenantShortage = Math.max(0, requiredDeposit - tenantBalance);
  const landlordShortage = Math.max(0, requiredDeposit - landlordBalance);

  const isTenant = userRole === "TENANT";
  const currentUserShortage = isTenant ? tenantShortage : landlordShortage;

  return (
    <>
      <Card className="bg-primary-foreground shadow-sm rounded-2xl border-none">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-primary flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Số dư tiền cọc
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Deposit Summary */}
          <div className="grid grid-cols-3 gap-3 p-2 bg-[#f5f5f5] rounded-lg">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Yêu cầu</p>
              <p className="text-sm font-bold text-foreground">
                {formatCurrency(requiredDeposit)}
              </p>
            </div>
            <div className="text-center border-l border-r border-gray-300">
              <p className="text-xs text-muted-foreground mb-1">Người thuê</p>
              <p
                className={`text-sm font-bold ${
                  tenantShortage > 0 ? "text-red-600" : "text-green-600"
                }`}
              >
                {formatCurrency(balance.balanceTenant)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Chủ nhà</p>
              <p
                className={`text-sm font-bold ${
                  landlordShortage > 0 ? "text-red-600" : "text-green-600"
                }`}
              >
                {formatCurrency(balance.balanceLandlord)}
              </p>
            </div>
          </div>

          {/* Current User Action */}
          {currentUserShortage > 0 ? (
            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-yellow-900 mb-1">
                    Bạn còn thiếu {formatCurrency(currentUserShortage)}
                  </p>
                  <p className="text-xs text-yellow-700">
                    Vui lòng nộp thêm để đủ tiền cọc yêu cầu
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleTopUpDeposit(currentUserShortage)}
                  className="bg-accent hover:bg-accent/80 ml-3"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Nộp thêm
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-sm font-medium text-green-900">
                  {tenantShortage === 0 && landlordShortage === 0
                    ? "Cả hai bên đã đặt đủ tiền cọc"
                    : "Bạn đã đặt đủ tiền cọc"}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={shortageAmount}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </>
  );
}
