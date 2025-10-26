"use client";

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
  // Don't render anything if invoice is null/undefined
  if (!invoice) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết hóa đơn</DialogTitle>
            <DialogDescription>Không có thông tin hóa đơn</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "PAID":
        return {
          label: "Đã thanh toán",
          className: "bg-green-100 text-green-800",
        };
      case "PENDING":
        return {
          label: "Chờ thanh toán",
          className: "bg-orange-100 text-orange-800",
        };
      case "OVERDUE":
        return {
          label: "Quá hạn",
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
            Chi tiết hóa đơn
          </DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về hóa đơn thanh toán
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Invoice Header Info */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  Mã hóa đơn:
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
                Kỳ thanh toán:{" "}
                <span className="font-medium">{invoice.billingPeriod}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">
                Hạn thanh toán:{" "}
                <span className="font-medium">
                  {formatDate(invoice.dueDate)}{" "}
                </span>
                <span className="text-red-400 font-bold">
                  {isPaymentOverdue(invoice.dueDate, invoice.status) &&
                    " (Quá hạn)"}
                </span>
              </span>
            </div>
          </div>

          <Separator />

          {/* Invoice Items */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Chi tiết các khoản</h3>

            <div className="space-y-3">
              {invoice.items.length > 0 ? (
                invoice.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-white border rounded-lg hover:border-gray-300 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {item.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      {formatCurrency(item.amount)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  Không có chi tiết khoản thanh toán
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Total Amount */}
          <div className="bg-[#FFF7E9] rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-900">
                Tổng cộng:
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
                Hủy
              </Button>
              <Button
                onClick={() => {
                  onPayInvoice(invoice.id);
                  onClose();
                }}
                className="bg-[#D4A574] hover:bg-[#D4A574]/90"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Thanh toán ngay
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
