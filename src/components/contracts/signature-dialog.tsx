"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
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
import {
  FileSignature,
  CheckCircle2,
  Download,
  AlertCircle,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { SigningMethodDialog } from "@/components/contracts/signing-method-dialog";
import { signingOption } from "@/lib/api/services/booking";
import { translateError } from "@/lib/constants/error-messages";
import { Card, CardContent } from "@/components/ui/card";

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
  const t = useTranslations("contract");
  const tCommon = useTranslations("common");
  const [showSigningMethod, setShowSigningMethod] = useState(false);
  const [signingLoading, setSigningLoading] = useState(false);
  const [signingStep, setSigningStep] = useState<
    "idle" | "signing" | "success"
  >("idle");
  const [selectedSigningMethod, setSelectedSigningMethod] =
    useState<signingOption>(signingOption.VNPT);
  const [extensionFileUrl, setExtensionFileUrl] = useState<string | null>(
    extension.extensionContractFileUrl
  );

  // Fetch fresh file URL when dialog opens
  useEffect(() => {
    if (open && extension.contractId) {
      const fetchFileUrl = async () => {
        try {
          const response = await contractService.getFileUrl(
            extension.contractId
          );

          if (response.data?.extensionFileUrls) {
            const extensionFile = response.data.extensionFileUrls.find(
              (file) => file.extensionId === extension.id
            );

            if (extensionFile?.fileUrl) {
              setExtensionFileUrl(extensionFile.fileUrl);
            }
          }
        } catch (error) {
          console.error("Error fetching extension file URL:", error);
          // Keep the existing extensionContractFileUrl from extension object
        }
      };

      void fetchFileUrl();
    }
  }, [open, extension.contractId, extension.id]);

  const handleSign = async (method: signingOption) => {
    setSigningLoading(true);
    setShowSigningMethod(false);
    setSelectedSigningMethod(method);

    // Small delay to ensure dialog closes
    await new Promise((resolve) => setTimeout(resolve, 100));

    setSigningStep("signing");

    try {
      if (userRole === "LANDLORD") {
        await contractService.landlordSignExtension(extension.id, method);
      } else if (userRole === "TENANT") {
        await contractService.tenantSignExtension(extension.id, method);
      }

      setSigningStep("success");
      toast.success("Thành công", "Bạn đã ký hợp đồng gia hạn");

      setTimeout(() => {
        onOpenChange(false);
        setSigningStep("idle");
        onSuccess();
      }, 2000);
    } catch (error) {
      console.error("Error signing contract:", error);
      const errorMessage = translateError(
        error,
        "Không thể ký hợp đồng. Vui lòng thử lại"
      );
      toast.error("Lỗi", errorMessage);
      setSigningStep("idle");
    } finally {
      setSigningLoading(false);
    }
  };

  const handleDownloadContract = async () => {
    // Use the fetched file URL if available
    if (extensionFileUrl) {
      // Create a temporary link to trigger download
      const link = document.createElement("a");
      link.href = extensionFileUrl;
      link.download = `hop-dong-gia-han-${extension.id.slice(0, 8)}.pdf`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    try {
      // Fetch latest file URLs from API as fallback
      const response = await contractService.getFileUrl(extension.contractId);

      if (response.data?.extensionFileUrls) {
        // Find the file URL for this specific extension
        const extensionFile = response.data.extensionFileUrls.find(
          (file) => file.extensionId === extension.id
        );

        if (extensionFile?.fileUrl) {
          // Create a temporary link to trigger download
          const link = document.createElement("a");
          link.href = extensionFile.fileUrl;
          link.download = `hop-dong-gia-han-${extension.id.slice(0, 8)}.pdf`;
          link.target = "_blank";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          return;
        }
      }

      toast.error(tCommon("error"), t("noContractFile"));
    } catch (error) {
      console.error("Error fetching contract file:", error);
      const errorMessage = translateError(error, "Không thể tải file hợp đồng");
      toast.error("Lỗi", errorMessage);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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

          {/* PDF Preview - Only show for LANDLORD */}
          {userRole === "LANDLORD" && (
            <Card className="bg-primary-foreground">
              <CardContent>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <FileSignature className="h-5 w-5" />
                  Xem trước hợp đồng gia hạn
                </h3>
                {extensionFileUrl ? (
                  <>
                    <div className="border rounded-lg overflow-hidden bg-gray-50">
                      <iframe
                        src={extensionFileUrl}
                        className="w-full h-[500px]"
                        title="Hợp đồng gia hạn"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      * Vui lòng đọc kỹ toàn bộ nội dung hợp đồng gia hạn trước
                      khi ký.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="border rounded-lg overflow-hidden bg-gray-50">
                      <iframe
                        src="/contract/PhuLucHopDongGiaHan.pdf"
                        className="w-full h-[500px]"
                        title="Mẫu hợp đồng gia hạn"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      * Đây là mẫu hợp đồng gia hạn. Hợp đồng thực tế sẽ được
                      điền thông tin cụ thể.
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Download Contract - For both roles */}
          {extensionFileUrl && (
            <Button
              variant="outline"
              className="w-full text-primary"
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
              {t("confirmReadTerms")} trong hợp đồng gia hạn.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={signingStep !== "idle"}
            className="text-red-500 border-red-500"
          >
            Hủy
          </Button>
          <Button
            onClick={() => setShowSigningMethod(true)}
            disabled={signingStep !== "idle"}
          >
            <FileSignature className="w-4 h-4 mr-2" />
            Ký hợp đồng
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Signing Method Dialog */}
      <SigningMethodDialog
        open={showSigningMethod}
        onOpenChange={setShowSigningMethod}
        onConfirm={handleSign}
        loading={signingLoading}
      />

      {/* Signing Progress Dialog */}
      {signingStep === "signing" && (
        <Dialog open={true} onOpenChange={() => {}}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Đang xử lý yêu cầu ký...</DialogTitle>
              <DialogDescription>
                {selectedSigningMethod === signingOption.VNPT
                  ? "Vui lòng kiểm tra điện thoại"
                  : "Đang ký hợp đồng"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
              <Card className="border-blue-200 bg-blue-50">
                <CardContent>
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div className="space-y-2">
                      <p className="font-medium text-blue-900">
                        {selectedSigningMethod === signingOption.VNPT
                          ? "Vui lòng kiểm tra điện thoại"
                          : "Đang ký hợp đồng"}
                      </p>
                      <p className="text-sm text-blue-800">
                        {selectedSigningMethod === signingOption.VNPT
                          ? "Hệ thống đang gửi yêu cầu ký hợp đồng đến điện thoại của bạn. Vui lòng mở ứng dụng VNPT SmartCA để ký xác nhận."
                          : "Hệ thống đang tự động ký hợp đồng bằng chữ ký số. Vui lòng đợi trong giây lát..."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Success Dialog */}
      {signingStep === "success" && (
        <Dialog open={true} onOpenChange={() => {}}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Ký thành công!
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Card className="border-green-200 bg-green-50">
                <CardContent>
                  <div className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <div className="space-y-2">
                      <p className="font-medium text-green-900">
                        Đã ký hợp đồng thành công!
                      </p>
                      <p className="text-sm text-green-800">
                        Hợp đồng gia hạn đã được ký. Hệ thống sẽ tự động cập
                        nhật trạng thái.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
}
