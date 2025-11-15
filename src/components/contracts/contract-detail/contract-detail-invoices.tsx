"use client";
import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Eye,
  Check,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Plus,
} from "lucide-react";
import { invoiceService, type Invoice } from "@/lib/api/services/invoice";
import { paymentService } from "@/lib/api/services/payment";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { PaymentModal } from "@/components/payment/payment-modal";
import InvoiceDetailDialog from "@/components/contracts/invoice-detail-dialog";
import { CreateInvoiceDialog } from "@/components/contracts/create-invoice-dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils/utils";

interface ContractDetailInvoicesProps {
  contractId: string;
  bookingStatus: string;
  userRole?: string;
  propertyType?: "APARTMENT" | "BOARDING" | "HOUSING";
}

export function ContractDetailInvoices({
  contractId,
  bookingStatus,
  userRole,
  propertyType = "APARTMENT",
}: ContractDetailInvoicesProps) {
  const t = useTranslations("contract");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  // Payment modal states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Invoice detail dialog states
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);

  // Create invoice dialog state
  const [showCreateInvoiceDialog, setShowCreateInvoiceDialog] = useState(false);

  const fetchInvoices = useCallback(async () => {
    const allowedStatuses = [
      "DUAL_ESCROW_FUNDED",
      "ACTIVE",
      "TERMINATED",
      "SETTLED",
      "SETTLEMENT_PENDING",
      "CANCELLED",
    ];

    if (!allowedStatuses.includes(bookingStatus)) {
      setLoading(false);
      return;
    }

    try {
      const response = await invoiceService.getInvoiceByContractId(contractId);
      setInvoices(response.data || []);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      toast.error(t("cannotLoadInvoiceList"));
    } finally {
      setLoading(false);
    }
  }, [contractId, bookingStatus, t]);

  useEffect(() => {
    void fetchInvoices();
  }, [fetchInvoices]);

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceDialog(true);
  };

  const handlePayInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (method: "VNPAY" | "WALLET") => {
    if (!selectedInvoice) return;

    try {
      toast.loading(t("loading"));

      const response = await paymentService.createPaymentByInvoice(
        selectedInvoice.id,
        method
      );

      toast.dismiss();

      if (method === "WALLET") {
        if (response.data?.status === "PAID") {
          toast.success(t("paymentSuccess"));
          await fetchInvoices();
        } else {
          toast.error(t("paymentFailedCheckWallet"));
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
      toast.dismiss();
      toast.error(t("cannotCreatePaymentRetry"));
    }
  };

  if (loading) {
    return (
      <Card className="bg-primary-foreground shadow-sm rounded-2xl border-none">
        <CardContent className="py-12 text-center">
          <LoadingSpinner size="lg" text={t("loadingInvoices")} />
        </CardContent>
      </Card>
    );
  }

  const allowedStatuses = [
    "DUAL_ESCROW_FUNDED",
    "ACTIVE",
    "TERMINATED",
    "SETTLED",
    "SETTLEMENT_PENDING",
    "CANCELLED",
  ];

  if (!allowedStatuses.includes(bookingStatus)) {
    return null;
  }

  // Disable actions for cancelled or terminated contracts (view only)
  const isActionsAllowed =
    bookingStatus !== "CANCELLED" && bookingStatus !== "TERMINATED";

  // If no invoices yet
  if (invoices.length === 0) {
    return (
      <>
        <Card className="bg-primary-foreground shadow-sm rounded-2xl border-none">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-primary flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {t("invoicesTitle")}
              </CardTitle>
              {userRole === "LANDLORD" && isActionsAllowed && (
                <Button
                  size="sm"
                  onClick={() => setShowCreateInvoiceDialog(true)}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  {t("createInvoice")}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <FileText className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="text-muted-foreground">{t("noInvoicesYet")}</p>
            </div>
          </CardContent>
        </Card>

        {/* Create Invoice Dialog */}
        <CreateInvoiceDialog
          isOpen={showCreateInvoiceDialog}
          onClose={() => setShowCreateInvoiceDialog(false)}
          contractId={contractId}
          propertyType={propertyType}
          onSuccess={fetchInvoices}
        />
      </>
    );
  }

  const mostRecentInvoice = invoices[0];
  const remainingInvoices = invoices.slice(1);

  return (
    <>
      <Card className="bg-primary-foreground shadow-sm rounded-2xl border-none">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold text-primary flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {t("invoicesTitle")} ({invoices.length})
            </CardTitle>
            {userRole === "LANDLORD" && isActionsAllowed && (
              <Button
                size="sm"
                onClick={() => setShowCreateInvoiceDialog(true)}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-1" />
                {t("createInvoice")}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            {/* Most Recent Invoice */}
            <div className="flex items-center justify-between rounded-lg bg-[#f5f5f5] py-4 px-4 mb-3">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "grid h-8 w-8 place-items-center rounded-full",
                    mostRecentInvoice.status === "PAID"
                      ? "bg-[#00AE26]"
                      : "bg-secondary"
                  )}
                >
                  <span className="text-sm font-semibold text-primary-foreground">
                    {invoices.length}
                  </span>
                </div>
                <div>
                  <div className="font-bold text-foreground">
                    {t("invoiceOf", {
                      period: new Date(
                        mostRecentInvoice.billingPeriod
                      ).toLocaleDateString("vi-VN", {
                        month: "2-digit",
                        year: "numeric",
                      }),
                    })}
                  </div>
                  <div className="text-xs text-[#4f4f4f]">
                    {t("dueDate")}:{" "}
                    <strong>
                      {new Date(mostRecentInvoice.dueDate).toLocaleDateString(
                        "vi-VN"
                      )}
                    </strong>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs text-primary"
                  onClick={() => handleViewInvoice(mostRecentInvoice)}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  {t("viewDetails")}
                </Button>
                {mostRecentInvoice.status === "PAID" ? (
                  <div className="flex items-center gap-2 text-xs text-foreground">
                    <div className="h-4 w-4 rounded-full bg-[#00AE26] flex items-center justify-center">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                    <span>{t("paidLabel")}</span>
                  </div>
                ) : mostRecentInvoice.status === "PENDING" ? (
                  userRole === "TENANT" && isActionsAllowed ? (
                    <Button
                      size="sm"
                      className="rounded-full bg-secondary text-primary-foreground hover:bg-secondary/85"
                      onClick={() => handlePayInvoice(mostRecentInvoice)}
                    >
                      {t("payButton")}
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-orange-600">
                      <div className="h-4 w-4 rounded-full bg-orange-500 flex items-center justify-center">
                        <AlertCircle className="h-3 w-3 text-white" />
                      </div>
                      <span>{t("pendingPayment")}</span>
                    </div>
                  )
                ) : (
                  <div className="flex items-center gap-2 text-xs text-foreground">
                    <div className="h-4 w-4 rounded-full bg-red-500 flex items-center justify-center">
                      <AlertCircle className="h-3 w-3 text-white" />
                    </div>
                    <span>{t("overdueStatus")}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Remaining Invoices */}
            {remainingInvoices.length > 0 && (
              <>
                <CollapsibleContent className="space-y-3">
                  {remainingInvoices.map((invoice, index) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between rounded-lg bg-[#f5f5f5] py-4 px-4"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "grid h-8 w-8 place-items-center rounded-full",
                            invoice.status === "PAID"
                              ? "bg-[#00AE26]"
                              : "bg-secondary"
                          )}
                        >
                          <span className="text-sm font-semibold text-primary-foreground">
                            {invoices.length - index - 1}
                          </span>
                        </div>
                        <div>
                          <div className="font-bold text-foreground">
                            {t("invoiceOf", {
                              period: new Date(
                                invoice.billingPeriod
                              ).toLocaleDateString("vi-VN", {
                                month: "2-digit",
                                year: "numeric",
                              }),
                            })}
                          </div>
                          <div className="text-xs text-[#4f4f4f]">
                            {t("dueDate")}:{" "}
                            <strong>
                              {new Date(invoice.dueDate).toLocaleDateString(
                                "vi-VN"
                              )}
                            </strong>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs text-primary"
                          onClick={() => handleViewInvoice(invoice)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          {t("viewDetails")}
                        </Button>
                        {invoice.status === "PAID" ? (
                          <div className="flex items-center gap-2 text-xs text-foreground">
                            <div className="h-4 w-4 rounded-full bg-[#00AE26] flex items-center justify-center">
                              <Check className="h-3 w-3 text-primary-foreground" />
                            </div>
                            <span>{t("paidLabel")}</span>
                          </div>
                        ) : invoice.status === "PENDING" ? (
                          userRole === "TENANT" && isActionsAllowed ? (
                            <Button
                              size="sm"
                              className="rounded-full bg-secondary text-primary-foreground hover:bg-secondary/85"
                              onClick={() => handlePayInvoice(invoice)}
                            >
                              {t("payButton")}
                            </Button>
                          ) : (
                            <div className="flex items-center gap-2 text-xs text-orange-600">
                              <div className="h-4 w-4 rounded-full bg-orange-500 flex items-center justify-center">
                                <AlertCircle className="h-3 w-3 text-white" />
                              </div>
                              <span>{t("pendingPayment")}</span>
                            </div>
                          )
                        ) : (
                          <div className="flex items-center gap-2 text-xs text-foreground">
                            <div className="h-4 w-4 rounded-full bg-red-500 flex items-center justify-center">
                              <AlertCircle className="h-3 w-3 text-white" />
                            </div>
                            <span>{t("overdueStatus")}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </CollapsibleContent>

                <div className="flex justify-center pt-3">
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="outline"
                      className="inline-flex items-center gap-2 bg-transparent px-4 py-2 text-muted-foreground border-none shadow-none"
                    >
                      {isExpanded ? (
                        <>
                          <div className="h-5 w-5 bg-secondary rounded-full flex items-center justify-center">
                            <ChevronUp className="h-4 w-4 text-primary-foreground" />
                          </div>
                          <span>{t("hideInvoices")}</span>
                        </>
                      ) : (
                        <>
                          <div className="h-5 w-5 bg-secondary rounded-full flex items-center justify-center">
                            <ChevronDown className="w-4 h-4 text-primary-foreground" />
                          </div>
                          <span>
                            {t("viewMoreInvoices", {
                              count: remainingInvoices.length,
                            })}
                          </span>
                        </>
                      )}
                    </Button>
                  </CollapsibleTrigger>
                </div>
              </>
            )}
          </Collapsible>
        </CardContent>
      </Card>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={selectedInvoice?.totalAmount || 0}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Invoice Detail Dialog */}
      <InvoiceDetailDialog
        isOpen={showInvoiceDialog}
        onClose={() => setShowInvoiceDialog(false)}
        invoice={selectedInvoice}
        onPayInvoice={
          userRole === "TENANT" && isActionsAllowed
            ? (invoiceId: string) => {
                const invoice = invoices.find((inv) => inv.id === invoiceId);
                if (invoice) {
                  handlePayInvoice(invoice);
                }
              }
            : undefined
        }
      />

      {/* Create Invoice Dialog */}
      <CreateInvoiceDialog
        isOpen={showCreateInvoiceDialog}
        onClose={() => setShowCreateInvoiceDialog(false)}
        contractId={contractId}
        propertyType={propertyType}
        onSuccess={fetchInvoices}
      />
    </>
  );
}
