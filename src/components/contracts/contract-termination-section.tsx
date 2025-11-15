"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileX, Plus, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ContractTerminationDialog,
  ContractTerminationList,
} from "@/components/contracts";

interface ContractTerminationSectionProps {
  contractId: string;
  contractEndDate: string; // ISO string format
  currentUserId: string;
  currentUserRole: "LANDLORD" | "TENANT";
  contractStatus: string;
}

export function ContractTerminationSection({
  contractId,
  contractEndDate,
  currentUserId,
  currentUserRole,
  contractStatus,
}: ContractTerminationSectionProps) {
  const t = useTranslations("contract");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Only allow termination for active contracts
  const canRequestTermination =
    contractStatus === "ACTIVE" || contractStatus === "active";

  const handleSuccess = () => {
    // Refresh the termination list
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <Card className="bg-primary-foreground">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileX className="h-5 w-5 text-muted-foreground" />
            <CardTitle>{t("terminateContractEarly")}</CardTitle>
          </div>
          {canRequestTermination && (
            <Button
              onClick={() => setShowCreateDialog(true)}
              size="sm"
              variant="outline"
              className="text-primary"
            >
              <Plus className="mr-2 h-4 w-4" />
              {t("createTerminationRequest")}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Information Alert */}
        {canRequestTermination ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {t("terminationInfo", {
                party:
                  currentUserRole === "LANDLORD"
                    ? t("otherParty")
                    : t("landlordParty"),
              })}
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{t("cannotCreateTermination")}</AlertDescription>
          </Alert>
        )}

        {/* Termination Requests List */}
        <div>
          <h3 className="text-sm font-medium mb-3">{t("terminationList")}</h3>
          <ContractTerminationList
            key={refreshKey}
            contractId={contractId}
            currentUserId={currentUserId}
          />
        </div>
      </CardContent>

      {/* Create Termination Dialog */}
      <ContractTerminationDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        contractId={contractId}
        contractEndDate={contractEndDate}
        onSuccess={handleSuccess}
      />
    </Card>
  );
}
