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
import { Loader2, FileSignature, CheckCircle2, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SignatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  extension: ContractExtension;
  userRole: string;
  onSuccess: () => void;
}

export function SignatureDialog({
  open,
  onOpenChange,
  extension,
  userRole,
  onSuccess,
}: SignatureDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleSign = async () => {
    setLoading(true);
    try {
      if (userRole === "LANDLORD") {
        await contractService.landlordSignExtension(extension.id);
        toast.success("Thành công", "Bạn đã ký hợp đồng gia hạn");
      } else if (userRole === "TENANT") {
        await contractService.tenantSignExtension(extension.id);
        toast.success("Thành công", "Bạn đã ký hợp đồng gia hạn");
      }

      onOpenChange(false);
      onSuccess();
    } catch {
      toast.error("Lỗi", "Không thể ký hợp đồng. Vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadContract = () => {
    if (extension.extensionContractFileUrl) {
      window.open(extension.extensionContractFileUrl, "_blank");
    } else {
      toast.error("Lỗi", "Không tìm thấy file hợp đồng");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ký hợp đồng gia hạn</DialogTitle>
          <DialogDescription>
            Xem xét kỹ hợp đồng trước khi ký. Sau khi cả hai bên ký, hợp đồng sẽ
            có hiệu lực.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Contract Info */}
          <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium">Thông tin hợp đồng gia hạn:</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground">Số tháng gia hạn</p>
                <p className="font-semibold">
                  {extension.extensionMonths} tháng
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">ID gia hạn</p>
                <p className="font-mono text-xs">
                  {extension.id.slice(0, 8)}...
                </p>
              </div>
            </div>
          </div>

          {/* Download Contract */}
          {extension.extensionContractFileUrl && (
            <Button
              variant="outline"
              className="w-full"
              onClick={handleDownloadContract}
              type="button"
            >
              <Download className="w-4 h-4 mr-2" />
              Tải xuống hợp đồng gia hạn
            </Button>
          )}

          {/* Signature Status */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Trạng thái ký:</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-900">
                {extension.landlordSignedAt ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                )}
                <span className="text-sm">
                  Chủ nhà {extension.landlordSignedAt ? "đã ký" : "chưa ký"}
                </span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-900">
                {extension.tenantSignedAt ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                )}
                <span className="text-sm">
                  Người thuê {extension.tenantSignedAt ? "đã ký" : "chưa ký"}
                </span>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <p className="text-xs text-amber-800 dark:text-amber-200">
              <span className="font-medium">Lưu ý:</span> Bằng việc ký hợp đồng,
              bạn xác nhận đã đọc và đồng ý với tất cả các điều khoản trong hợp
              đồng gia hạn.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button onClick={handleSign} disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {!loading && <FileSignature className="w-4 h-4 mr-2" />}
            Ký hợp đồng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
