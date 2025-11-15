"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Eye,
  CheckCircle,
  AlertCircle,
  Calendar,
  FileText,
  Copy,
  Check,
} from "lucide-react";
import type { Booking } from "@/lib/api/services/booking";
import { bookingService, signingOption } from "@/lib/api/services/booking";
import { paymentService, PaymentPurpose } from "@/lib/api/services/payment";
import { toast } from "sonner";
import { PaymentModal } from "@/components/payment/payment-modal";
import { EscrowBalanceDetailCard } from "@/components/contracts/escrow-balance-detail-card";
import { SigningMethodDialog } from "@/components/contracts/signing-method-dialog";
import { ContractFileSelectorDialog } from "@/components/contracts/contract-file-selector-dialog";
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
  const t = useTranslations("contract");
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
  const [showFileSelectorDialog, setShowFileSelectorDialog] = useState(false);
  const [copiedContractCode, setCopiedContractCode] = useState(false);

  const handleViewContract = async () => {
    if (!booking.contract?.id) return;
    setShowFileSelectorDialog(true);
  };

  const handleCopyContractCode = async () => {
    if (!booking.contract?.contractCode) return;

    try {
      await navigator.clipboard.writeText(booking.contract.contractCode);
      setCopiedContractCode(true);
      toast.success(t("copiedContractCode"));

      // Reset icon after 2 seconds
      setTimeout(() => {
        setCopiedContractCode(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error(t("cannotCopyContractCode"));
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
      toast.error(t("cannotSignContract"));
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
          toast.success(t("paymentSuccess"));
          onRefresh();
        } else {
          toast.error(t("paymentFailed"));
        }
      } else {
        if (response.data?.paymentUrl) {
          toast.success(t("redirectingToPayment"));
          window.location.href = response.data.paymentUrl;
        } else {
          toast.error(t("cannotCreatePayment"));
        }
      }

      setShowPaymentModal(false);
    } catch (error) {
      console.error(error);
      toast.error(t("cannotCreatePaymentRetry"));
    }
  };

  const handleHandover = async () => {
    try {
      toast.loading(t("confirmingHandover"));
      await bookingService.handover(booking.id);
      toast.dismiss();
      toast.success(t("handoverSuccess"));
      onRefresh();
    } catch (error) {
      console.error(error);
      toast.dismiss();
      toast.error(t("cannotConfirmHandover"));
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
                        {t("signContractRequest")}
                      </p>
                      <p className="text-sm text-yellow-800 mt-1">
                        {t("tenantSentRequest")}
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
                          {t("viewContract")}
                        </Button>
                      )}
                      <Button
                        size="sm"
                        onClick={() => setSigningMethodDialog(true)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {t("signContract")}
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
                    <p className="font-semibold text-yellow-900">
                      {t("waitingApproval")}
                    </p>
                    <p className="text-sm text-yellow-800 mt-1">
                      {t("waitingLandlordApproval")}
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
                      {t("waitingSignature")}
                    </p>
                    <p className="text-sm text-orange-800 mt-1">
                      {t("pleaseReviewAndSign")}
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
                        {t("viewContract")}
                      </Button>
                    )}
                    <Button
                      size="sm"
                      onClick={() => setSigningMethodDialog(true)}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {t("signContract")}
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
                      {t("depositRequired")}
                    </p>
                    <p className="text-sm text-blue-800 mt-1">
                      {t("bothPartiesDeposit")}
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
                        {t("viewContract")}
                      </Button>
                    )}
                    <Button size="sm" onClick={handleDepositPayment}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {t("depositNow")}
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
                        ? t("depositRequired")
                        : t("deposited")}
                    </p>
                    <p className="text-sm text-purple-800 mt-1">
                      {userRole === "LANDLORD"
                        ? t("tenantDeposited2")
                        : t("waitingLandlordDeposit")}
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
                        {t("viewContract")}
                      </Button>
                    )}
                    {userRole === "LANDLORD" && (
                      <Button size="sm" onClick={handleDepositPayment}>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {t("depositNow")}
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
                        ? t("readyForHandover")
                        : t("waitingHandover")}
                    </p>
                    <p className="text-sm text-emerald-800 mt-1">
                      {userRole === "LANDLORD"
                        ? t("bothPartiesDepositedLandlord")
                        : t("bothPartiesDepositedTenant")}
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
                        {t("viewContract")}
                      </Button>
                    )}
                    {userRole === "LANDLORD" && (
                      <Button size="sm" onClick={handleHandover}>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {t("confirmHandover")}
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
      case "TERMINATED":
      case "SETTLED":
      case "CANCELLED":
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
                          {t("rentalContract")}
                        </p>
                        {booking.contract.contractCode && (
                          <p className="text-sm text-muted-foreground">
                            {t("contractCode")}:{" "}
                            <span className="font-mono font-medium text-foreground">
                              {booking.contract.contractCode}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {booking.contract.contractCode && (
                        <Button
                          size="sm"
                          onClick={handleCopyContractCode}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          {copiedContractCode ? (
                            <>
                              <Check className="w-4 h-4 mr-1" />
                              {t("copied")}
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-1" />
                              {t("copy")}
                            </>
                          )}
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        onClick={handleViewContract}
                        className="text-primary"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        {t("viewContract")}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            {booking.contract?.id &&
              booking.status !== "CANCELLED" &&
              booking.status !== "TERMINATED" && (
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

      {/* Contract File Selector Dialog */}
      {booking.contract?.id && (
        <ContractFileSelectorDialog
          open={showFileSelectorDialog}
          onOpenChange={setShowFileSelectorDialog}
          contractId={booking.contract.id}
        />
      )}

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
                ? t("processingSignRequest")
                : t("signedSuccessfully")}
            </DialogTitle>
            <DialogDescription>
              {signingStep === "signing"
                ? selectedSigningMethod === signingOption.VNPT
                  ? t("pleaseCheckPhone")
                  : t("processingSigning")
                : t("importantInfo")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {signingStep === "signing" && (
              <>
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent>
                    <div className="flex gap-3">
                      <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div className="space-y-2">
                        <p className="font-medium text-blue-900">
                          {selectedSigningMethod === signingOption.VNPT
                            ? t("pleaseCheckPhone")
                            : t("signing")}
                        </p>
                        <p className="text-sm text-blue-800">
                          {selectedSigningMethod === signingOption.VNPT
                            ? t("vnptSigningInstructions")
                            : t("autoSigningInstructions")}
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
                  <CardContent>
                    <div className="flex gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div className="space-y-2">
                        <p className="font-medium text-green-900">
                          {t("signedSuccessMessage")}
                        </p>
                        <p className="text-sm text-green-800">
                          {t("bothPartiesDepositMessage")}
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
                    {t("close")}
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
