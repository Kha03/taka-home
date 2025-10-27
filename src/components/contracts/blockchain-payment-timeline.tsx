"use client";

import { BlockchainPaymentValue } from "@/types/contracts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface BlockchainPaymentTimelineProps {
  history: BlockchainPaymentValue[]; // Changed from BlockchainPaymentHistoryItem[]
  contractId?: string; // Optional filter by contract ID
}

const getStatusBadge = (status: string) => {
  const statusMap: Record<
    string,
    {
      label: string;
      variant: "default" | "secondary" | "destructive" | "outline";
    }
  > = {
    PAID: { label: "Đã thanh toán", variant: "default" },
    SCHEDULED: { label: "Đã lên lịch", variant: "secondary" },
    OVERDUE: { label: "Quá hạn", variant: "destructive" },
  };

  const config = statusMap[status] || {
    label: status,
    variant: "outline" as const,
  };
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "PAID":
      return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    case "SCHEDULED":
      return <Clock className="h-5 w-5 text-blue-600" />;
    case "OVERDUE":
      return <AlertCircle className="h-5 w-5 text-red-600" />;
    default:
      return <FileText className="h-5 w-5 text-gray-600" />;
  }
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

export function BlockchainPaymentTimeline({
  history,
  contractId,
}: BlockchainPaymentTimelineProps) {
  // Debug: Log để xem cấu trúc dữ liệu
  console.log("Payment History:", history);
  console.log("Filter ContractId:", contractId);

  // Filter by contractId if provided
  const filteredHistory = contractId
    ? history.filter((payment) => {
        return payment.contractId === contractId;
      })
    : history;

  // Sort by createdAt descending (newest first)
  const sortedHistory = [...filteredHistory].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (sortedHistory.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {contractId
          ? `Không tìm thấy thanh toán cho hợp đồng ${contractId}`
          : "Không có dữ liệu thanh toán"}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedHistory.map((payment) => {
        // Skip if payment is null/undefined
        if (!payment) return null;

        return (
          <Card key={payment.paymentId} className="bg-primary-foreground">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(payment.status)}
                    <CardTitle className="text-lg">
                      Thanh toán kỳ {payment.period}
                    </CardTitle>
                  </div>
                  <CardDescription className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <Clock className="h-3 w-3" />
                      <span>{formatDateTime(payment.createdAt)}</span>
                    </div>
                    <div className="font-mono text-xs text-muted-foreground break-all">
                      ID: {payment.paymentId}
                    </div>
                  </CardDescription>
                </div>
                <div>{getStatusBadge(payment.status)}</div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Payment Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Mã thanh toán:</span>
                    <span className="font-mono text-xs">
                      {payment.paymentId || "N/A"}
                    </span>
                  </div>

                  {payment.contractId && (
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Hợp đồng:</span>
                      <span className="font-mono">{payment.contractId}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Số tiền:</span>
                    <span className="font-semibold text-primary">
                      {formatCurrency(payment.amount)}
                    </span>
                  </div>

                  {payment.paidAmount && (
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Đã thanh toán:</span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(payment.paidAmount)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Hạn thanh toán:</span>
                    <span>{formatDateTime(payment.dueDate)}</span>
                  </div>

                  {payment.paidAt && (
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Đã thanh toán:</span>
                      <span>{formatDateTime(payment.paidAt)}</span>
                    </div>
                  )}

                  {payment.overdueAt && (
                    <div className="flex items-center gap-2 text-sm">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <span className="font-medium">Quá hạn lúc:</span>
                      <span>{formatDateTime(payment.overdueAt)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Reference */}
              {payment.orderRef && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-sm">Order Reference</span>
                  </div>
                  <p className="text-xs font-mono break-all text-muted-foreground">
                    {payment.orderRef}
                  </p>
                </div>
              )}

              {/* Penalties */}
              {payment.penalties && payment.penalties.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <h4 className="font-medium text-sm">
                      Phạt ({payment.penalties.length})
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {payment.penalties.map((penalty, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">
                            {formatCurrency(penalty.amount)}
                          </span>
                          <Badge variant="destructive" className="text-xs">
                            {penalty.policyRef}
                          </Badge>
                        </div>
                        <p className="text-xs mb-1">{penalty.reason}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>Áp dụng bởi: {penalty.appliedBy}</span>
                          <span>•</span>
                          <span>{formatDateTime(penalty.appliedAt)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div>
                  <span className="font-medium">Tạo lúc:</span>{" "}
                  {formatDateTime(payment.createdAt)}
                </div>
                <div>
                  <span className="font-medium">Cập nhật:</span>{" "}
                  {formatDateTime(payment.updatedAt)}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
