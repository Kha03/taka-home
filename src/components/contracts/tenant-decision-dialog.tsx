"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { contractService } from "@/lib/api/services/contract";
import { ContractExtension } from "@/types/contracts";
import { Loader2, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { translateError } from "@/lib/constants/error-messages";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TenantDecisionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  extension: ContractExtension;
  onSuccess: () => void;
}

export function TenantDecisionDialog({
  open,
  onOpenChange,
  extension,
  onSuccess,
}: TenantDecisionDialogProps) {
  const [loading, setLoading] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  const formatCurrency = (amount: number | null) => {
    if (!amount) return "Không thay đổi";
    return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
  };

  const handleAccept = async () => {
    setLoading(true);
    try {
      await contractService.tenantDecisionOnExtension(
        extension.id,
        "AWAITING_SIGNATURES"
      );

      toast.success(
        "Thành công",
        "Đã đồng ý điều kiện gia hạn. Vui lòng ký hợp đồng."
      );
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Error accepting extension:", error);
      const errorMessage = translateError(
        error,
        "Không thể gửi quyết định. Vui lòng thử lại"
      );
      toast.error("Lỗi", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      await contractService.tenantRejectionOnExtension(extension.id);

      toast.success("Đã từ chối", "Bạn đã từ chối điều kiện gia hạn");
      setRejectDialogOpen(false);
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Error rejecting extension:", error);
      const errorMessage = translateError(
        error,
        "Không thể từ chối. Vui lòng thử lại"
      );
      toast.error("Lỗi", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Điều kiện gia hạn từ chủ nhà</DialogTitle>
            <DialogDescription>
              Xem xét điều kiện và quyết định đồng ý hoặc từ chối
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Extension Info */}
            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3 space-y-1">
              <p className="text-sm font-medium">Thông tin gia hạn:</p>
              <p className="text-sm text-muted-foreground">
                Số tháng gia hạn:{" "}
                <span className="font-semibold">
                  {extension.extensionMonths} tháng
                </span>
              </p>
            </div>

            {/* Landlord Response */}
            <div className="space-y-3">
              <p className="text-sm font-semibold">Điều kiện từ chủ nhà:</p>

              <div className="grid gap-3">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-lg">
                  <span className="text-sm text-muted-foreground">
                    Giá thuê mới:
                  </span>
                  <span className="text-sm font-bold text-blue-600">
                    {formatCurrency(extension.newMonthlyRent)}
                  </span>
                </div>
              </div>

              {extension.responseNote && (
                <div className="bg-indigo-50 dark:bg-indigo-950/20 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">
                    Lời nhắn từ chủ nhà:
                  </p>
                  <p className="text-sm">{extension.responseNote}</p>
                </div>
              )}
            </div>

            {/* Warning */}
            <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-yellow-800 dark:text-yellow-200">
                <p className="font-medium mb-1">Lưu ý quan trọng:</p>
                <p>
                  Sau khi đồng ý, bạn và chủ nhà sẽ cần ký hợp đồng gia hạn. Nếu
                  từ chối, yêu cầu gia hạn sẽ bị hủy.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(true)}
              disabled={loading}
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Từ chối
            </Button>
            <Button onClick={handleAccept} disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {!loading && <CheckCircle2 className="w-4 h-4 mr-2" />}
              Đồng ý & Tiếp tục
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Confirmation Dialog */}
      <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận từ chối</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn từ chối điều kiện gia hạn này? Hành động này
              không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              disabled={loading}
              className="bg-red-600"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Từ chối gia hạn
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
