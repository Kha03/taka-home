"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Eye,
  CheckCircle,
  AlertCircle,
  Calendar,
  FileText,
} from "lucide-react";
import type { Booking } from "@/lib/api/services/booking";
import { bookingService, signingOption } from "@/lib/api/services/booking";
import { contractService } from "@/lib/api/services/contract";
import { paymentService, PaymentPurpose } from "@/lib/api/services/payment";
import { toast } from "sonner";
import { PaymentModal } from "@/components/payment/payment-modal";
import { EscrowBalanceDetailCard } from "@/components/contracts/escrow-balance-detail-card";
import { SigningMethodDialog } from "@/components/contracts/signing-method-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ContractDetailActionsProps {
  booking: Booking;
  userRole: string;
  onRefresh: () => void;
}

export function ContractDetailActions({
  booking,
  userRole,
  onRefresh,
}: ContractDetailActionsProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [signingMethodDialog, setSigningMethodDialog] = useState(false);
  const [signingLoading, setSigningLoading] = useState(false);
  const [signingDialog, setSigningDialog] = useState(false);
  const [signingStep, setSigningStep] = useState<"signing" | "success">(
    "signing"
  );
  const [selectedSigningMethod, setSelectedSigningMethod] =
    useState<signingOption>(signingOption.VNPT);

  const handleViewContract = async () => {
    if (!booking.contract?.id) return;

    try {
      const response = await contractService.getFileUrl(booking.contract.id);
      if (response.data?.fileUrl) {
        window.open(response.data.fileUrl, "_blank");
      } else {
        toast.error("Không tìm thấy file hợp đồng");
      }
    } catch (error) {
      console.error(error);
      toast.error("Không thể mở file hợp đồng");
    }
  };

  const handleSignContract = async (method: signingOption) => {
    setSigningLoading(true);
    setSigningMethodDialog(false);
    setSelectedSigningMethod(method);

    // Small delay to ensure dialog closes before showing next one
    await new Promise((resolve) => setTimeout(resolve, 100));

    setSigningStep("signing");
    setSigningDialog(true);

    try {
      await bookingService.signContract(booking.id, method);
      setSigningStep("success");
    } catch (error) {
      console.error(error);
      setSigningDialog(false);
      setSigningStep("signing");
      toast.error("Không thể ký hợp đồng. Vui lòng thử lại");
    } finally {
      setSigningLoading(false);
    }
  };

  const handleDepositPayment = () => {
    const { property, room } = booking;
    const deposit = room
      ? parseFloat(room.roomType.deposit)
      : parseFloat(property.deposit || "0");

    setPaymentAmount(deposit);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (method: "VNPAY" | "WALLET") => {
    if (!booking.contract?.id) return;

    try {
      const purpose =
        userRole === "TENANT"
          ? PaymentPurpose.TENANT_ESCROW_DEPOSIT
          : PaymentPurpose.LANDLORD_ESCROW_DEPOSIT;

      const response = await paymentService.createPayment({
        contractId: booking.contract.id,
        amount: paymentAmount,
        method,
        purpose,
      });

      if (method === "WALLET") {
        if (response.data?.status === "PAID") {
          toast.success("Thanh toán thành công!");
          onRefresh();
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

  const handleHandover = async () => {
    try {
      toast.loading("Đang xác nhận bàn giao...");
      await bookingService.handover(booking.id);
      toast.dismiss();
      toast.success("Bàn giao thành công! Hợp đồng đã được kích hoạt.");
      onRefresh();
    } catch (error) {
      console.error(error);
      toast.dismiss();
      toast.error("Không thể xác nhận bàn giao. Vui lòng thử lại");
    }
  };

  // Render actions based on booking status
  const renderActions = () => {
    switch (booking.status) {
      case "PENDING_LANDLORD":
        if (userRole === "LANDLORD") {
          return (
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="py-6">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="space-y-3 flex-1">
                    <div>
                      <p className="font-semibold text-yellow-900">
                        Yêu cầu ký hợp đồng
                      </p>
                      <p className="text-sm text-yellow-800 mt-1">
                        Người thuê đã gửi yêu cầu thuê. Vui lòng xem xét và ký
                        hợp đồng.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {booking.contract?.id && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-primary"
                          onClick={handleViewContract}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Xem hợp đồng
                        </Button>
                      )}
                      <Button
                        size="sm"
                        onClick={() => setSigningMethodDialog(true)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Ký hợp đồng
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        } else {
          return (
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="py-6">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-yellow-900">Chờ duyệt</p>
                    <p className="text-sm text-yellow-800 mt-1">
                      Đang chờ chủ nhà duyệt yêu cầu thuê.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        }

      case "PENDING_SIGNATURE":
        return (
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="py-6">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-orange-600 mt-0.5" />
                <div className="space-y-3 flex-1">
                  <div>
                    <p className="font-semibold text-orange-900">
                      Chờ ký hợp đồng
                    </p>
                    <p className="text-sm text-orange-800 mt-1">
                      Vui lòng xem xét và ký hợp đồng để tiếp tục.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {booking.contract?.id && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-primary"
                        onClick={handleViewContract}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Xem hợp đồng
                      </Button>
                    )}
                    <Button
                      size="sm"
                      onClick={() => setSigningMethodDialog(true)}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Ký hợp đồng
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "AWAITING_DEPOSIT":
        return (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="py-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="space-y-3 flex-1">
                  <div>
                    <p className="font-semibold text-blue-900">
                      Yêu cầu đặt cọc
                    </p>
                    <p className="text-sm text-blue-800 mt-1">
                      Bạn và chủ nhà cần đặt cọc để kích hoạt hợp đồng. Vui lòng
                      hoàn tất việc đặt cọc trong thời gian quy định.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {booking.contract?.id && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-primary"
                        onClick={handleViewContract}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Xem hợp đồng
                      </Button>
                    )}
                    <Button size="sm" onClick={handleDepositPayment}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Đặt cọc ngay
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "ESCROW_FUNDED_T":
        return (
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="py-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-purple-600 mt-0.5" />
                <div className="space-y-3 flex-1">
                  <div>
                    <p className="font-semibold text-purple-900">
                      {userRole === "LANDLORD"
                        ? "Yêu cầu đặt cọc"
                        : "Đã đặt cọc"}
                    </p>
                    <p className="text-sm text-purple-800 mt-1">
                      {userRole === "LANDLORD"
                        ? "Người thuê đã đặt cọc. Đến lượt bạn đặt cọc để kích hoạt hợp đồng."
                        : "Bạn đã hoàn tất đặt cọc. Đang chờ chủ nhà đặt cọc để kích hoạt hợp đồng."}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {booking.contract?.id && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-primary"
                        onClick={handleViewContract}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Xem hợp đồng
                      </Button>
                    )}
                    {userRole === "LANDLORD" && (
                      <Button size="sm" onClick={handleDepositPayment}>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Đặt cọc ngay
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "READY_FOR_HANDOVER":
        return (
          <Card className="bg-emerald-50 border-emerald-200">
            <CardContent className="py-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5" />
                <div className="space-y-3 flex-1">
                  <div>
                    <p className="font-semibold text-emerald-900">
                      {userRole === "LANDLORD"
                        ? "Sẵn sàng bàn giao"
                        : "Chờ bàn giao"}
                    </p>
                    <p className="text-sm text-emerald-800 mt-1">
                      {userRole === "LANDLORD"
                        ? "Cả hai bên đã hoàn tất đặt cọc. Vui lòng xác nhận bàn giao để kích hoạt hợp đồng."
                        : "Cả hai bên đã hoàn tất đặt cọc. Đang chờ chủ nhà xác nhận bàn giao để kích hoạt hợp đồng."}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {booking.contract?.id && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-primary"
                        onClick={handleViewContract}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Xem hợp đồng
                      </Button>
                    )}
                    {userRole === "LANDLORD" && (
                      <Button size="sm" onClick={handleHandover}>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Xác nhận bàn giao
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "ACTIVE":
      case "DUAL_ESCROW_FUNDED":
        const { property, room } = booking;
        const requiredDeposit = room
          ? parseFloat(room.roomType.deposit)
          : parseFloat(property.deposit || "0");

        return (
          <div className="space-y-4">
            {booking.contract?.id && (
              <Card className="bg-primary-foreground">
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-semibold text-foreground">
                          Hợp đồng thuê nhà
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Xem chi tiết hợp đồng của bạn
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleViewContract}
                      className="text-primary"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Xem hợp đồng
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            {booking.contract?.id && (
              <EscrowBalanceDetailCard
                contractId={booking.contract.id}
                requiredDeposit={requiredDeposit}
                userRole={userRole}
                onRefresh={onRefresh}
              />
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {renderActions()}

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={paymentAmount}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Signing Method Dialog */}
      <SigningMethodDialog
        open={signingMethodDialog}
        onOpenChange={setSigningMethodDialog}
        onConfirm={handleSignContract}
        loading={signingLoading}
      />

      {/* Signing Progress Dialog */}
      <Dialog open={signingDialog} onOpenChange={setSigningDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {signingStep === "signing"
                ? "Đang xử lý yêu cầu ký..."
                : "Ký hợp đồng thành công"}
            </DialogTitle>
            <DialogDescription>
              {signingStep === "signing"
                ? selectedSigningMethod === signingOption.VNPT
                  ? "Vui lòng kiểm tra điện thoại"
                  : "Đang xử lý yêu cầu ký"
                : "Thông tin quan trọng"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {signingStep === "signing" && (
              <>
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="pt-6">
                    <div className="flex gap-3">
                      <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div className="space-y-2">
                        <p className="font-medium text-blue-900">
                          {selectedSigningMethod === signingOption.VNPT
                            ? "Vui lòng kiểm tra điện thoại"
                            : "Đang ký hợp đồng"}
                        </p>
                        <p className="text-sm text-blue-800">
                          {selectedSigningMethod === signingOption.VNPT
                            ? "Hệ thống đang gửi yêu cầu ký hợp đồng đến điện thoại của bạn. Vui lòng mở ứng dụng VNPT SmartCA để ký xác nhận."
                            : "Hệ thống đang tự động ký hợp đồng bằng chữ ký số. Vui lòng đợi trong giây lát..."}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
            {signingStep === "success" && (
              <>
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="pt-6">
                    <div className="flex gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div className="space-y-2">
                        <p className="font-medium text-green-900">
                          Đã ký thành công!
                        </p>
                        <p className="text-sm text-green-800">
                          Bạn và chủ nhà hãy đặt cọc cho hợp đồng. Hệ thống sẽ
                          tự động cập nhật trạng thái sau khi hoàn tất.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <div className="flex justify-end">
                  <Button
                    onClick={() => {
                      setSigningDialog(false);
                      setSigningStep("signing");
                      onRefresh();
                    }}
                  >
                    Đóng
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
