"use client";
import { Card, CardHeader } from "@/components/ui/card";
import { Calendar, CheckCircle, AlertCircle } from "lucide-react";
import type { Booking } from "@/lib/api/services/booking";
import { useMemo } from "react";
import { useTranslations } from "next-intl";

interface ContractDetailHeaderProps {
  booking: Booking;
  userRole: string;
}

function getStatusConfig(
  status: Booking["status"],
  userRole: string,
  t: (key: string) => string
) {
  switch (status) {
    case "ACTIVE":
      return {
        bg: "bg-[#00AE26]/20",
        icon: <CheckCircle className="w-8 h-8 text-green-600" />,
        text: t("validContract"),
        description: t("validContractDesc"),
      };
    case "DUAL_ESCROW_FUNDED":
      return {
        bg: "bg-[#00AE26]/20",
        icon: <CheckCircle className="w-8 h-8 text-green-600" />,
        text: t("validContract"),
        description: t("validContractDesc"),
      };
    case "PENDING_SIGNATURE":
      return {
        bg: "bg-[#FFA500]/20",
        icon: <Calendar className="w-8 h-8 text-orange-600" />,
        text: t("pendingSignatureStatus"),
        description: t("pendingSignatureDesc"),
      };
    case "PENDING_LANDLORD":
      return {
        bg: "bg-[#818181]/10",
        icon: <Calendar className="w-8 h-8 text-gray-600" />,
        text:
          userRole === "LANDLORD"
            ? t("pendingSignatureStatus")
            : t("pendingLandlord"),
        description:
          userRole === "LANDLORD"
            ? t("pendingLandlordDesc")
            : t("waitingLandlordDesc"),
      };
    case "AWAITING_DEPOSIT":
      return {
        bg: "bg-[#3B82F6]/20",
        icon: <AlertCircle className="w-8 h-8 text-blue-600" />,
        text: t("awaitingDepositStatus"),
        description: t("awaitingDepositDesc"),
      };
    case "ESCROW_FUNDED_T":
      return {
        bg: "bg-[#9333EA]/20",
        icon: <AlertCircle className="w-8 h-8 text-purple-600" />,
        text:
          userRole === "LANDLORD"
            ? t("awaitingDepositStatus")
            : t("waitingLandlord"),
        description:
          userRole === "LANDLORD"
            ? t("yourTurnDeposit")
            : t("waitingLandlordDeposit2"),
      };
    case "READY_FOR_HANDOVER":
      return {
        bg: "bg-[#10B981]/20",
        icon: <CheckCircle className="w-8 h-8 text-emerald-600" />,
        text: t("readyForHandoverStatus"),
        description:
          userRole === "LANDLORD"
            ? t("pleaseConfirmHandover")
            : t("waitingLandlordHandover"),
      };
    case "REJECTED":
      return {
        bg: "bg-[#FA0000]/10",
        icon: <AlertCircle className="w-8 h-8 text-red-600" />,
        text: t("rejectedStatus"),
        description: t("rejectedDesc"),
      };
    case "ESCROW_FUNDED_L":
      return {
        bg: "bg-[#9333EA]/20",
        icon: <AlertCircle className="w-8 h-8 text-purple-600" />,
        text:
          userRole === "TENANT"
            ? t("awaitingDepositStatus")
            : t("waitingTenant"),
        description:
          userRole === "TENANT"
            ? t("yourTurnDeposit")
            : t("waitingTenantDeposit"),
      };
    case "TERMINATED":
      return {
        bg: "bg-[#6B7280]/20",
        icon: <AlertCircle className="w-8 h-8 text-gray-600" />,
        text: t("terminatedStatus"),
        description: t("terminatedDesc"),
      };
    case "CANCELLED":
      return {
        bg: "bg-[#EF4444]/20",
        icon: <AlertCircle className="w-8 h-8 text-red-600" />,
        text: t("cancelledStatus"),
        description: t("cancelledDesc"),
      };
    case "SETTLEMENT_PENDING":
      return {
        bg: "bg-[#F59E0B]/20",
        icon: <AlertCircle className="w-8 h-8 text-amber-600" />,
        text: t("waitingPayment"),
        description: t("waitingPayment"),
      };
    case "SETTLED":
      return {
        bg: "bg-[#10B981]/20",
        icon: <CheckCircle className="w-8 h-8 text-emerald-600" />,
        text: t("paidLabel"),
        description: t("paidLabel"),
      };
    default:
      return {
        bg: "bg-gray-100",
        icon: <Calendar className="w-8 h-8 text-gray-600" />,
        text: t("undefined"),
        description: "",
      };
  }
}

export function ContractDetailHeader({
  booking,
  userRole,
}: ContractDetailHeaderProps) {
  const t = useTranslations("contract");
  const statusConfig = useMemo(
    () => getStatusConfig(booking.status, userRole, t),
    [booking.status, userRole, t]
  );

  return (
    <Card className="bg-primary-foreground shadow-sm rounded-2xl border-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary mb-2">
              {t("details")}
            </h1>
            <div className="flex items-center gap-4 text-sm text-[#4f4f4f]">
              <span className="bg-secondary text-primary font-bold px-4 py-2 rounded-full">
                {booking.contract?.contractCode || booking.id}
              </span>
              <span>•</span>
              <span>
                {t("tenant2")}:{" "}
                <strong className="text-secondary">
                  {booking.tenant.fullName}
                </strong>
              </span>
              <span>•</span>
              <span>
                {t("landlord")}:{" "}
                <strong className="text-secondary">
                  {booking.property.landlord.fullName}
                </strong>
              </span>
            </div>
          </div>
          <div
            className={`${statusConfig.bg} min-w-[160px] rounded-[10px] p-6 flex flex-col items-center justify-center`}
          >
            {statusConfig.icon}
            <p className="text-sm font-medium mt-2">{statusConfig.text}</p>
            {statusConfig.description && (
              <p className="text-xs text-center mt-1 text-muted-foreground">
                {statusConfig.description}
              </p>
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
