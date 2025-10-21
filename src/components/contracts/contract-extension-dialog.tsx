"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { contractService } from "@/lib/api/services/contract";
import type { ContractExtensionRequest } from "@/types/contracts";

interface ContractExtensionDialogProps {
  contractId: string;
  currentEndDate: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ContractExtensionDialog({
  contractId,
  currentEndDate,
  open,
  onOpenChange,
  onSuccess,
}: ContractExtensionDialogProps) {
  const [extensionMonths, setExtensionMonths] = useState<string>("");
  const [requestNote, setRequestNote] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    // Validation
    const months = parseInt(extensionMonths);
    if (isNaN(months) || months < 1) {
      toast.error("Vui lòng nhập số tháng hợp lệ (từ 1 trở lên)");
      return;
    }
    if (months > 12) {
      toast.error("Số tháng gia hạn tối đa là 12 tháng");
      return;
    }
    if (!requestNote.trim()) {
      toast.error("Vui lòng nhập lý do gia hạn");
      return;
    }

    try {
      setIsSubmitting(true);
      const request: ContractExtensionRequest = {
        contractId,
        extensionMonths: months,
        requestNote: requestNote.trim(),
      };

      const response = await contractService.extendContractRequest(request);

      if (response.code === 200 || response.code === 201) {
        toast.success("Gửi yêu cầu gia hạn hợp đồng thành công!");
        onOpenChange(false);
        setExtensionMonths("");
        setRequestNote("");
        onSuccess?.();
      } else {
        toast.error(response.message || "Có lỗi xảy ra khi gửi yêu cầu");
      }
    } catch (error) {
      console.error("Error extending contract:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Không thể gửi yêu cầu gia hạn";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateNewEndDate = () => {
    if (!extensionMonths || isNaN(parseInt(extensionMonths))) return null;
    const months = parseInt(extensionMonths);
    if (months < 1 || months > 12) return null;

    try {
      // Parse DD/MM/YYYY format
      let currentEnd: Date;
      if (currentEndDate.includes("/")) {
        const [day, month, year] = currentEndDate.split("/").map(Number);
        currentEnd = new Date(year, month - 1, day);
      } else {
        currentEnd = new Date(currentEndDate);
      }

      // Validate date
      if (isNaN(currentEnd.getTime())) return null;

      // Calculate new end date
      const newEnd = new Date(currentEnd);
      newEnd.setMonth(newEnd.getMonth() + months);

      return newEnd.toLocaleDateString("vi-VN");
    } catch {
      return null;
    }
  };

  const newEndDate = calculateNewEndDate();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Calendar className="w-4 h-4 text-primary" />
            Gia hạn hợp đồng
          </DialogTitle>
          <DialogDescription className="text-sm">
            Gửi yêu cầu gia hạn hợp đồng cho chủ nhà. Vui lòng điền đầy đủ thông
            tin.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {/* Current End Date Display */}
          <div className="rounded-lg bg-muted/50 p-3 space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium">
              <Clock className="w-3 h-3 text-muted-foreground" />
              <span>Ngày kết thúc hiện tại</span>
            </div>
            <p className="text-base font-semibold pl-5">{currentEndDate}</p>
          </div>

          {/* Extension Months Input */}
          <div className="space-y-1.5">
            <Label htmlFor="extensionMonths" className="text-sm">
              Số tháng gia hạn <span className="text-destructive">*</span>
            </Label>
            <Input
              id="extensionMonths"
              type="number"
              min="1"
              max="12"
              placeholder="Nhập số tháng (1-12)"
              value={extensionMonths}
              onChange={(e) => setExtensionMonths(e.target.value)}
              className="text-sm h-9"
            />
            <p className="text-xs text-muted-foreground">Tối đa 12 tháng</p>
          </div>

          {/* New End Date Preview */}
          {newEndDate && (
            <div className="rounded-lg bg-primary/10 border border-primary/20 p-3 space-y-1">
              <div className="flex items-center gap-2 text-xs font-medium text-primary">
                <Calendar className="w-3 h-3" />
                <span>Ngày kết thúc mới (dự kiến)</span>
              </div>
              <p className="text-base font-semibold pl-5 text-primary">
                {newEndDate}
              </p>
            </div>
          )}

          {/* Request Note */}
          <div className="space-y-1.5">
            <Label htmlFor="requestNote" className="text-sm">
              Lý do gia hạn <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="requestNote"
              placeholder="Nhập lý do bạn muốn gia hạn hợp đồng..."
              value={requestNote}
              onChange={(e) => setRequestNote(e.target.value)}
              className="min-h-[80px] text-sm resize-none"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {requestNote.length}/500
            </p>
          </div>

          {/* Warning Note */}
          <div className="flex gap-2 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 dark:text-amber-200">
              Yêu cầu gia hạn sẽ được gửi đến chủ nhà để xem xét. Bạn sẽ nhận
              được thông báo khi có phản hồi.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="text-red-500 border-red-500 h-9 text-sm"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="gap-2 h-9 text-sm"
          >
            {isSubmitting ? (
              <>Đang gửi...</>
            ) : (
              <>
                <Calendar className="w-3.5 h-3.5" />
                Gửi yêu cầu
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
