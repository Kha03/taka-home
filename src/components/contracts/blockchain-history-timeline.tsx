"use client";

import { useTranslations } from "next-intl";
import { BlockchainContractHistoryItem } from "@/types/contracts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileSignature,
  Coins,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface BlockchainHistoryTimelineProps {
  history: BlockchainContractHistoryItem[];
}

const StatusBadge = ({ status }: { status: string }) => {
  const t = useTranslations("contract");
  const statusMap: Record<
    string,
    {
      label: string;
      variant: "default" | "secondary" | "destructive" | "outline";
    }
  > = {
    PENDING_SIGNATURE: { label: t("pendingSignature"), variant: "outline" },
    WAIT_DEPOSIT: { label: t("waitingDeposit"), variant: "secondary" },
    WAIT_FIRST_PAYMENT: { label: t("waitingPayment"), variant: "secondary" },
    ACTIVE: { label: t("activeStatus"), variant: "default" },
    EXPIRED: { label: t("expired"), variant: "destructive" },
    CANCELLED: { label: t("cancelled"), variant: "destructive" },
  };

  const config = statusMap[status] || {
    label: status,
    variant: "outline" as const,
  };
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const formatDateTime = (dateString: string) => {
  try {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm:ss", { locale: vi });
  } catch {
    return dateString;
  }
};

export function BlockchainHistoryTimeline({
  history,
}: BlockchainHistoryTimelineProps) {
  const t = useTranslations("contract");

  // Sort by timestamp descending (newest first)
  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="space-y-4">
      {sortedHistory.map((item, index) => {
        const { value } = item;
        const isLatest = index === 0;

        return (
          <Card
            key={item.txId}
            className={`${
              isLatest ? "border-primary shadow-md" : ""
            } bg-primary-foreground`}
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">
                      {t("transaction")} #{sortedHistory.length - index}
                    </CardTitle>
                    {isLatest && <Badge variant="default">{t("newest")}</Badge>}
                  </div>
                  <CardDescription className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <Clock className="h-3 w-3" />
                      <span>{formatDateTime(item.timestamp)}</span>
                    </div>
                    <div className="font-mono text-xs text-muted-foreground break-all">
                      TX: {item.txId}
                    </div>
                  </CardDescription>
                </div>
                <div>{getStatusBadge(value.status)}</div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Contract Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <FileSignature className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{t("contractCode")}:</span>
                    <span className="font-mono">{value.contractId}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Coins className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{t("monthlyRent")}:</span>
                    <span className="font-semibold text-primary">
                      {formatCurrency(value.rentAmount)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Coins className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{t("deposit")}:</span>
                    <span>{formatCurrency(value.depositAmount)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{t("startingDate")}:</span>
                    <span>{formatDateTime(value.startDate)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{t("endingDate")}:</span>
                    <span>{formatDateTime(value.endDate)}</span>
                  </div>

                  {value.activatedAt && (
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="font-medium">{t("activated")}:</span>
                      <span>{formatDateTime(value.activatedAt)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Signatures */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">
                  {t("electronicSignature")}:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      {value.signatures.landlord.status === "SIGNED" ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-yellow-600" />
                      )}
                      <span className="font-medium text-sm">
                        {t("landlordLabel")}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {value.signatures.landlord.status === "SIGNED"
                        ? `${t("signed")}: ${formatDateTime(
                            value.signatures.landlord.signedAt
                          )}`
                        : t("notSigned")}
                    </p>
                    {value.landlordSignedHash && (
                      <p className="text-xs font-mono text-muted-foreground mt-1 truncate">
                        {t("hash")}: {value.landlordSignedHash.substring(0, 16)}
                        ...
                      </p>
                    )}
                  </div>

                  {value.signatures.tenant && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        {value.signatures.tenant.status === "SIGNED" ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <Clock className="h-4 w-4 text-yellow-600" />
                        )}
                        <span className="font-medium text-sm">
                          {t("tenantLabel")}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {value.signatures.tenant.status === "SIGNED"
                          ? `${t("signed")}: ${formatDateTime(
                              value.signatures.tenant.signedAt
                            )}`
                          : t("notSigned")}
                      </p>
                    </div>
                  )}
                </div>

                {/* Fully Signed Hash */}
                {value.fullySignedHash && (
                  <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-sm">
                        {t("completedHash")}
                      </span>
                    </div>
                    <p className="text-xs font-mono break-all text-muted-foreground">
                      {value.fullySignedHash}
                    </p>
                  </div>
                )}
              </div>

              {/* Deposit Status */}
              {(value.deposit.landlord || value.deposit.tenant) && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">{t("depositStatus")}:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {value.deposit.landlord && (
                      <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-sm">
                            {t("landlordLabel")}
                          </span>
                        </div>
                        <p className="text-xs">
                          {formatCurrency(value.deposit.landlord.amount)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDateTime(value.deposit.landlord.depositedAt)}
                        </p>
                      </div>
                    )}

                    {value.deposit.tenant && (
                      <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-sm">
                            {t("tenantLabel")}
                          </span>
                        </div>
                        <p className="text-xs">
                          {formatCurrency(value.deposit.tenant.amount)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDateTime(value.deposit.tenant.depositedAt)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* First Payment */}
              {value.firstPayment && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">{t("firstPayment")}:</h4>
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-sm">
                        {formatCurrency(value.firstPayment.amount)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(value.firstPayment.paidAt)}
                    </p>
                  </div>
                </div>
              )}

              {/* Extensions */}
              {value.extensions && value.extensions.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-medium text-sm">
                      {t("extensions")} ({value.extensions.length})
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {value.extensions.map((ext, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">
                            {t("extensionNumber")} {ext.extensionNumber}
                          </Badge>
                          <Badge>{ext.status}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">
                              {t("previousDate")}:
                            </span>
                            <p>{formatDateTime(ext.previousEndDate)}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              {t("newDate")}:
                            </span>
                            <p>{formatDateTime(ext.newEndDate)}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              {t("previousPrice")}:
                            </span>
                            <p>{formatCurrency(ext.previousRentAmount)}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              {t("newPrice")}:
                            </span>
                            <p className="font-semibold text-primary">
                              {formatCurrency(ext.newRentAmount)}
                            </p>
                          </div>
                        </div>
                        {ext.extensionAgreementHash && (
                          <div className="mt-2 p-2 bg-muted/50 rounded border border-muted">
                            <div className="flex items-center gap-2 mb-1">
                              <FileSignature className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs font-medium text-muted-foreground">
                                {t("extensionAgreementHash")}
                              </span>
                            </div>
                            <p className="text-xs font-mono break-all text-muted-foreground">
                              {ext.extensionAgreementHash}
                            </p>
                          </div>
                        )}
                        {ext.notes && (
                          <p className="text-xs text-muted-foreground mt-2">
                            {t("notes")}: {ext.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Penalties */}
              {value.penalties && value.penalties.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <h4 className="font-medium text-sm">
                      {t("penalties")} ({value.penalties.length})
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {value.penalties.map((penalty, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">
                            {formatCurrency(penalty.amount)}
                          </span>
                          <Badge variant="destructive">{penalty.party}</Badge>
                        </div>
                        <p className="text-xs">{penalty.reason}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDateTime(penalty.timestamp)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
