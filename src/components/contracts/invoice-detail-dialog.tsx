"use client";

import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, DollarSign, CreditCard } from "lucide-react";
import type { Invoice } from "@/lib/api/services/invoice";
import { ServiceTypeEnum } from "@/lib/api/services/invoice";
import { isPaymentOverdue } from "@/lib/utils/utils";

interface InvoiceDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  onPayInvoice?: (invoiceId: string) => void;
}

export default function InvoiceDetailDialog({
  isOpen,
  onClose,
  invoice,
  onPayInvoice,
}: InvoiceDetailDialogProps) {
  const t = useTranslations("invoice");
  // Don't render anything if invoice is null/undefined
  if (!invoice) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("details")}</DialogTitle>
            <DialogDescription>{t("noInvoiceInfo")}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "PAID":
        return {
          label: `${t("paymentStatus.PAID")}`,
          className: "bg-green-100 text-green-800",
        };
      case "PENDING":
        return {
          label: `${t("paymentStatus.PENDING")}`,
          className: "bg-orange-100 text-orange-800",
        };
      case "OVERDUE":
        return {
          label: `${t("paymentStatus.OVERDUE")}`,
          className: "bg-red-100 text-red-800",
        };
      default:
        return {
          label: status,
          className: "bg-gray-100 text-gray-800",
        };
    }
  };

  const statusDisplay = getStatusDisplay(invoice.status);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {t("invoiceDetails")}
          </DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Invoice Header Info */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  {t("invoiceCode")}:
                </span>
                <span className="text-sm font-semibold">
                  {invoice.invoiceCode}
                </span>
              </div>
              <Badge className={statusDisplay.className}>
                {statusDisplay.label}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">
                {t("billingPeriod")}:
                <span className="font-medium">{invoice.billingPeriod}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">
                {t("dueDate")}:
                <span className="font-medium">
                  {formatDate(invoice.dueDate)}{" "}
                </span>
                <span className="text-red-400 font-bold">
                  {isPaymentOverdue(invoice.dueDate, invoice.status) &&
                    ` (${t("paymentStatus.overdue")})`}
                </span>
              </span>
            </div>
          </div>

          <Separator />

          {/* Invoice Items */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">{t("detail")}</h3>

            <div className="space-y-3">
              {invoice.items.length > 0 ? (
                invoice.items.map((item) => {
                  // Get service type label - prefer serviceType field, fallback to detecting from description
                  const getServiceTypeLabel = () => {
                    // If serviceType is provided by backend, use it
                    if (item.serviceType) {
                      return t(`serviceTypes.${item.serviceType}`);
                    }

                    // Otherwise, try to detect from description
                    const lowerDesc = item.description.toLowerCase();
                    if (
                      lowerDesc.includes("điện") ||
                      lowerDesc.includes("electric")
                    ) {
                      return t("serviceTypes.ELECTRICITY");
                    }
                    if (
                      lowerDesc.includes("nước") ||
                      lowerDesc.includes("water")
                    ) {
                      return t("serviceTypes.WATER");
                    }
                    if (
                      lowerDesc.includes("xe") ||
                      lowerDesc.includes("parking")
                    ) {
                      return t("serviceTypes.PARKING");
                    }
                    if (
                      lowerDesc.includes("internet") ||
                      lowerDesc.includes("wifi")
                    ) {
                      return t("serviceTypes.INTERNET");
                    }
                    if (
                      lowerDesc.includes("vệ sinh") ||
                      lowerDesc.includes("cleaning")
                    ) {
                      return t("serviceTypes.CLEANING");
                    }
                    if (
                      lowerDesc.includes("bảo vệ") ||
                      lowerDesc.includes("security")
                    ) {
                      return t("serviceTypes.SECURITY");
                    }
                    if (
                      lowerDesc.includes("thiệt hại") ||
                      lowerDesc.includes("damage") ||
                      lowerDesc.includes("compensation")
                    ) {
                      return t("serviceTypes.DAMAGE_COMPENSATION");
                    }
                    if (
                      lowerDesc.includes("thuê") ||
                      lowerDesc.includes("rent")
                    ) {
                      return t("serviceTypes.RENT");
                    }
                    return t("serviceTypes.OTHER");
                  };

                  return (
                    <div
                      key={item.id}
                      className="p-3 bg-white border rounded-lg hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="text-xs font-medium"
                            >
                              {getServiceTypeLabel()}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            {item.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 whitespace-nowrap">
                          <DollarSign className="w-4 h-4 text-gray-500" />
                          {formatCurrency(item.amount)}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-4 text-gray-500">
                  {t("noPaymentDetails")}
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Total Amount */}
          <div className="bg-[#FFF7E9] rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-900">
                {t("totalAmount")}
              </span>
              <span className="text-2xl font-bold text-[#D4A574]">
                {formatCurrency(invoice.totalAmount)}
              </span>
            </div>
          </div>

          {/* Payment Button */}
          {invoice.status === "PENDING" && onPayInvoice && (
            <div className="flex justify-end gap-3 ">
              <Button
                variant="outline"
                onClick={onClose}
                className="text-primary"
              >
                {t("cancel")}
              </Button>
              <Button
                onClick={() => {
                  onPayInvoice(invoice.id);
                  onClose();
                }}
                className="bg-[#D4A574] hover:bg-[#D4A574]/90"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                {t("payNow")}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
