"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { ContractExtensionStatus } from "@/components/contracts/contract-extension-status";
import { ContractExpiryAlert } from "@/components/contracts/contract-expiry-alert";
import { ContractExtensionDialog } from "@/components/contracts/contract-extension-dialog";
import { useMemo, useState } from "react";

interface ContractDetailExtensionsProps {
  contractId: string;
  userRole: string;
  endDate: string;
  propertyType: string;
}

export function ContractDetailExtensions({
  contractId,
  userRole,
  endDate,
  propertyType,
}: ContractDetailExtensionsProps) {
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

  // Show extension alert if contract expires within 60 days
  const shouldShowExtensionAlert = useMemo(() => {
    return (
      userRole === "TENANT" &&
      daysUntilEnd !== null &&
      daysUntilEnd > 0 &&
      daysUntilEnd <= 60
    );
  }, [userRole, daysUntilEnd]);

  return (
    <>
      <Card className="bg-primary-foreground shadow-sm rounded-2xl border-none">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-primary flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Gia hạn hợp đồng
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
            propertyType={propertyType}
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
