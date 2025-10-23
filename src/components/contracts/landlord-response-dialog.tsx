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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contractService } from "@/lib/api/services/contract";
import { ContractExtension } from "@/types/contracts";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface LandlordResponseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  extension: ContractExtension;
  onSuccess: () => void;
}

export function LandlordResponseDialog({
  open,
  onOpenChange,
  extension,
  onSuccess,
}: LandlordResponseDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    newMonthlyRent: "",
    responseNote: "",
  });

  const handleSubmit = async () => {
    // Validation
    if (!formData.responseNote.trim()) {
      toast.error("Lỗi", "Vui lòng nhập lời nhắn phản hồi");
      return;
    }

    setLoading(true);
    try {
      await contractService.respondToContractExtensionRequest(extension.id, {
        status: "LANDLORD_RESPONDED",
        responseNote: formData.responseNote,
        newMonthlyRent: formData.newMonthlyRent
          ? parseFloat(formData.newMonthlyRent)
          : null,
      });

      toast.success("Thành công", "Đã gửi phản hồi yêu cầu gia hạn");
      onOpenChange(false);
      onSuccess();
    } catch {
      toast.error("Lỗi", "Không thể gửi phản hồi. Vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Phản hồi yêu cầu gia hạn</DialogTitle>
          <DialogDescription>
            Nhập điều kiện gia hạn hợp đồng. Nếu không thay đổi giá, để trống.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Request Info */}
          <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3 space-y-1">
            <p className="text-sm font-medium">Yêu cầu từ người thuê:</p>
            <p className="text-sm text-muted-foreground">
              Số tháng gia hạn:{" "}
              <span className="font-semibold">{extension.extensionMonths}</span>
            </p>
            {extension.requestNote && (
              <div className="mt-2 pt-2 border-t">
                <p className="text-xs text-muted-foreground">Lời nhắn:</p>
                <p className="text-sm">{extension.requestNote}</p>
              </div>
            )}
          </div>

          {/* New Monthly Rent */}
          <div className="space-y-2">
            <Label htmlFor="newMonthlyRent">
              Giá thuê mới (đ/tháng){" "}
              <span className="text-muted-foreground text-xs">(Tùy chọn)</span>
            </Label>
            <Input
              id="newMonthlyRent"
              type="number"
              placeholder="Để trống nếu giữ nguyên"
              value={formData.newMonthlyRent}
              onChange={(e) =>
                setFormData({ ...formData, newMonthlyRent: e.target.value })
              }
            />
          </div>

          {/* Response Note */}
          <div className="space-y-2">
            <Label htmlFor="responseNote">
              Lời nhắn phản hồi <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="responseNote"
              placeholder="Nhập lời nhắn của bạn cho người thuê..."
              rows={4}
              value={formData.responseNote}
              onChange={(e) =>
                setFormData({ ...formData, responseNote: e.target.value })
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="text-red-500 border-red-500"
          >
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Gửi phản hồi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
