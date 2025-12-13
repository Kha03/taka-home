"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { ContractExtensionStatus } from "@/components/contracts/contract-extension-status";
import { ContractExpiryAlert } from "@/components/contracts/contract-expiry-alert";
import { ContractExtensionDialog } from "@/components/contracts/contract-extension-dialog";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

interface ContractDetailExtensionsProps {
  contractId: string;
  userRole: string;
  endDate: string;
  requiredDeposit: number;
  bookingStatus?: string; // Thêm bookingStatus để kiểm tra trạng thái hợp đồng
}

export function ContractDetailExtensions({
  contractId,
  userRole,
  endDate,
  requiredDeposit,
  bookingStatus,
}: ContractDetailExtensionsProps) {
  const t = useTranslations("contract");
  const [extensionDialogOpen, setExtensionDialogOpen] = useState(false);

  // Calculate days remaining until contract end
  const daysUntilEnd = useMemo(() => {
    if (!endDate) return null;

    try {
      const end = new Date(endDate);
      if (isNaN(end.getTime())) return null;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      const diffTime = end.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return diffDays;
    } catch {
      return null;
    }
  }, [endDate]);

  // Show extension alert if contract expires within 60 days AND contract is still active
  // Không cho phép gia hạn khi hợp đồng đã TERMINATED, SETTLED, hoặc CANCELLED
  const shouldShowExtensionAlert = useMemo(() => {
    const inactiveStatuses = [
      "TERMINATED",
      "SETTLED",
      "CANCELLED",
      "SETTLEMENT_PENDING",
    ];
    const isContractInactive =
      bookingStatus && inactiveStatuses.includes(bookingStatus);

    return (
      userRole === "TENANT" &&
      !isContractInactive && // Hợp đồng không ở trạng thái đã kết thúc
      daysUntilEnd !== null &&
      daysUntilEnd > 0 && // Hợp đồng còn hiệu lực
      daysUntilEnd <= 60
    );
  }, [userRole, daysUntilEnd, bookingStatus]);

  return (
    <>
      <Card className="bg-primary-foreground shadow-sm rounded-2xl border-none">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-primary flex items-center gap-2">
            <Clock className="w-5 h-5" />
            {t("contractExtension")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Extension Alert for Tenant */}
          {shouldShowExtensionAlert && daysUntilEnd && (
            <ContractExpiryAlert
              endDate={endDate}
              daysRemaining={daysUntilEnd}
              onExtendClick={() => setExtensionDialogOpen(true)}
            />
          )}

          {/* Extension Status */}
          <ContractExtensionStatus
            contractId={contractId}
            userRole={userRole}
            requiredDeposit={requiredDeposit}
          />
        </CardContent>
      </Card>

      {/* Extension Dialog */}
      <ContractExtensionDialog
        contractId={contractId}
        currentEndDate={endDate}
        open={extensionDialogOpen}
        onOpenChange={setExtensionDialogOpen}
        onSuccess={() => {
          console.log("Extension request sent successfully");
        }}
      />
    </>
  );
}
