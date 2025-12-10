"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, FileText } from "lucide-react";
import { useState } from "react";
import { CreateInvoiceDialog } from "@/components/contracts/create-invoice-dialog";
import { useTranslations, useLocale } from "next-intl";

interface ContractLiquidationAlertProps {
  contractId: string;
  contractEndDate: string;
  propertyType: "APARTMENT" | "BOARDING" | "HOUSING";
  userRole: string;
  onInvoiceCreated?: () => void;
}

export function ContractLiquidationAlert({
  contractId,
  contractEndDate,
  propertyType,
  userRole,
  onInvoiceCreated,
}: ContractLiquidationAlertProps) {
  const t = useTranslations("contract");
  const locale = useLocale();
  const [showCreateInvoiceDialog, setShowCreateInvoiceDialog] = useState(false);

  // Check if contract is within last 7 days
  const endDate = new Date(contractEndDate);
  const today = new Date();
  const daysUntilEnd = Math.ceil(
    (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Only show for landlord and within last 7 days
  if (userRole !== "LANDLORD" || daysUntilEnd > 7 || daysUntilEnd < 0) {
    return null;
  }

  return (
    <>
      <Card className="bg-amber-50 border-amber-200 shadow-sm rounded-2xl">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-amber-900 mb-1">
                {t("liquidationReminder")}
              </h3>
              <p
                className="text-sm text-amber-800 mb-3"
                dangerouslySetInnerHTML={{
                  __html: t("contractEndsIn")
                    .replace("{days}", daysUntilEnd.toString())
                    .replace(
                      "{date}",
                      endDate.toLocaleDateString(
                        locale === "vi" ? "vi-VN" : "en-US"
                      )
                    ),
                }}
              />
              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  onClick={() => setShowCreateInvoiceDialog(true)}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  {t("createLiquidationInvoice")}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Invoice Dialog */}
      <CreateInvoiceDialog
        isOpen={showCreateInvoiceDialog}
        onClose={() => setShowCreateInvoiceDialog(false)}
        contractId={contractId}
        propertyType={propertyType}
        onSuccess={() => {
          setShowCreateInvoiceDialog(false);
          onInvoiceCreated?.();
        }}
        isLiquidation={true}
      />
    </>
  );
}
