/**
 * Wallet Transaction History Component
 * Hiển thị lịch sử giao dịch ví
 */

"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/utils";
import {
  paymentService,
  WalletHistoryResponse,
} from "@/lib/api/services/payment";
import { toast } from "@/hooks/use-toast";
import { LoadingSpinner } from "../ui/loading-spinner";

export interface WalletTransactionHistoryProps {
  className?: string;
}

export function WalletTransactionHistory({
  className = "",
}: WalletTransactionHistoryProps) {
  const t = useTranslations("wallet");
  const [transactions, setTransactions] = useState<WalletHistoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await paymentService.getWalletHistory();
      if (response.code === 200 && response.data) {
        setTransactions(response.data);
      } else {
        setError(t("errorLoading"));
      }
    } catch {
      setError(t("errorLoading"));
      toast.error(t("errorLoading"), t("errorLoading"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(numAmount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getTransactionIcon = (
    direction: "CREDIT" | "DEBIT",
    status: string
  ) => {
    if (status === "PENDING") {
      return <Clock className="w-5 h-5 text-orange-500" />;
    }
    if (status === "FAILED") {
      return <XCircle className="w-5 h-5 text-red-500" />;
    }
    if (direction === "CREDIT") {
      return <ArrowDownLeft className="w-5 h-5 text-green-600" />;
    }
    return <ArrowUpRight className="w-5 h-5 text-blue-600" />;
  };

  const getTransactionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      TOPUP: t("transactionType.TOPUP"),
      CONTRACT_PAYMENT: t("transactionType.CONTRACT_PAYMENT"),
      REFUND: t("transactionType.REFUND"),
    };
    return labels[type] || type;
  };

  const getStatusBadge = (status: string) => {
    const config: Record<
      string,
      { label: string; className: string; icon: React.ReactNode }
    > = {
      COMPLETED: {
        label: t("status.COMPLETED"),
        className: "bg-green-100 text-green-700 border-green-200",
        icon: <CheckCircle className="w-3 h-3" />,
      },
      PENDING: {
        label: t("status.PENDING"),
        className: "bg-orange-100 text-orange-700 border-orange-200",
        icon: <Clock className="w-3 h-3" />,
      },
      FAILED: {
        label: t("status.FAILED"),
        className: "bg-red-100 text-red-700 border-red-200",
        icon: <XCircle className="w-3 h-3" />,
      },
    };

    const statusConfig = config[status] || config.PENDING;

    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border",
          statusConfig.className
        )}
      >
        {statusConfig.icon}
        {statusConfig.label}
      </span>
    );
  };

  if (loading) {
    return (
      <Card
        className={cn("border-none shadow-sm bg-primary-foreground", className)}
      >
        <CardHeader>
          <CardTitle>{t("transactionHistory")}</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSpinner text={t("loading")} />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card
        className={cn("border-none shadow-sm bg-primary-foreground", className)}
      >
        <CardHeader>
          <CardTitle>{t("transactionHistory")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <AlertCircle className="w-12 h-12 text-red-500" />
            <p className="text-gray-600">{error}</p>
            <Button onClick={fetchHistory} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              {t("tryAgain")}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card
        className={cn("border-none shadow-sm bg-primary-foreground", className)}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t("transactionHistory")}</CardTitle>
            <Button
              onClick={fetchHistory}
              variant="ghost"
              size="sm"
              disabled={loading}
            >
              <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-900 mb-1">
                {t("noTransactions")}
              </p>
              <p className="text-sm text-gray-500">{t("transactionHistory")}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn("border-none shadow-sm bg-primary-foreground", className)}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t("transactionHistory")}</CardTitle>
          <Button
            onClick={fetchHistory}
            variant="ghost"
            size="sm"
            disabled={loading}
          >
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-start gap-4 p-4 rounded-lg border border-gray-200"
            >
              {/* Icon */}
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                  transaction.direction === "CREDIT"
                    ? "bg-green-100"
                    : "bg-blue-100"
                )}
              >
                {getTransactionIcon(transaction.direction, transaction.status)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {getTransactionTypeLabel(transaction.type)}
                    </h4>
                    {transaction.note && (
                      <p className="text-sm text-gray-600 mt-0.5">
                        {transaction.note}
                      </p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p
                      className={cn(
                        "font-bold text-lg",
                        transaction.direction === "CREDIT"
                          ? "text-green-600"
                          : "text-blue-600"
                      )}
                    >
                      {transaction.direction === "CREDIT" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-2">
                  {getStatusBadge(transaction.status)}
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(
                      transaction.completedAt || transaction.createdAt
                    )}
                  </span>
                  {transaction.refId && (
                    <span className="text-xs text-gray-500">
                      {t("transactionId")}: {transaction.refId}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination hoặc Load More có thể thêm ở đây */}
        {transactions.length >= 10 && (
          <div className="mt-6 text-center">
            <Button variant="outline" disabled className="text-primary">
              {t("loadMore")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
