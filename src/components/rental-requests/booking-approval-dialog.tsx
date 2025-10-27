"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, Download, CheckCircle2, AlertCircle } from "lucide-react";
import type { Booking } from "@/lib/api/services/booking";
import { signingOption } from "@/lib/api/services/booking";
import { SigningMethodDialog } from "@/components/contracts/signing-method-dialog";

interface BookingApprovalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: Booking | null;
  onConfirmApprove: (
    bookingId: string,
    method: signingOption
  ) => Promise<Booking | undefined>;
}

export function BookingApprovalDialog({
  open,
  onOpenChange,
  booking,
  onConfirmApprove,
}: BookingApprovalDialogProps) {
  type DialogState = "approval" | "signing-method" | "approving" | "result";
  const [dialogState, setDialogState] = useState<DialogState>("approval");
  const [selectedSigningMethod, setSelectedSigningMethod] =
    useState<signingOption>(signingOption.VNPT);
  const [approvalResult, setApprovalResult] = useState<{
    contractCode?: string;
    signedPdfUrl?: string;
  } | null>(null);

  const handleApprove = async (method: signingOption) => {
    if (!booking) return;

    try {
      setSelectedSigningMethod(method);
      setDialogState("approving");

      const updatedBooking = await onConfirmApprove(booking.id, method);

      // Sử dụng data từ response hoặc fallback sang booking ban đầu
      const contractData = updatedBooking?.contract || booking.contract;
      const pdfUrl = updatedBooking?.signedPdfUrl || booking.signedPdfUrl;

      setApprovalResult({
        contractCode: contractData?.contractCode || "CT-UNKNOWN",
        signedPdfUrl: pdfUrl,
      });

      setDialogState("result");
    } catch (error) {
      console.error("Error approving booking:", error);
      setDialogState("approval");
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    setDialogState("approval");
    setApprovalResult(null);
    onOpenChange(false);
  };

  const handleDownloadPdf = () => {
    if (approvalResult?.signedPdfUrl) {
      window.open(approvalResult.signedPdfUrl, "_blank");
    }
  };

  if (!booking) return null;

  const property = booking.property;
  const room = booking.room;
  const tenant = booking.tenant;
  const isBoarding = property.type === "BOARDING";

  const price = isBoarding
    ? parseFloat(room?.roomType?.price || "0")
    : property.price || 0;
  const deposit = isBoarding
    ? parseFloat(room?.roomType?.deposit || "0")
    : parseFloat(property.deposit || "0");

  // Nếu đang xử lý duyệt - hiển thị dialog loading với hướng dẫn
  if (dialogState === "approving") {
    return (
      <Dialog open={true} onOpenChange={() => {}}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Đang xử lý yêu cầu duyệt...</DialogTitle>
            <DialogDescription>
              {selectedSigningMethod === signingOption.VNPT
                ? "Vui lòng kiểm tra điện thoại"
                : "Đang ký hợp đồng"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Loading spinner */}
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>

            {/* Hướng dẫn */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <p className="font-medium text-blue-900">
                      {selectedSigningMethod === signingOption.VNPT
                        ? "Vui lòng kiểm tra điện thoại"
                        : "Đang ký hợp đồng"}
                    </p>
                    <p className="text-sm text-blue-800">
                      {selectedSigningMethod === signingOption.VNPT
                        ? "Hệ thống đang gửi yêu cầu ký hợp đồng đến điện thoại của bạn. Hãy mở ứng dụng VNPT SmartCA trên điện thoại để ký xác nhận hợp đồng. Sau khi ký thành công, hệ thống sẽ tự động cập nhật trạng thái."
                        : "Hệ thống đang tự động ký hợp đồng bằng chữ ký số. Vui lòng đợi trong giây lát..."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Nếu đang hiển thị kết quả sau khi duyệt
  if (dialogState === "result" && approvalResult) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              <DialogTitle>Duyệt yêu cầu thành công!</DialogTitle>
            </div>
            <DialogDescription>
              Yêu cầu thuê đã được duyệt. Booking đã cập nhật trạng thái đợi
              người thuê kí.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Thông tin hợp đồng */}
            <Card className="bg-primary-foreground">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Mã hợp đồng</p>
                    <p className="font-semibold text-lg">
                      {approvalResult.contractCode}
                    </p>
                  </div>
                  <Badge variant="default" className="bg-green-500">
                    Đã tạo
                  </Badge>
                </div>

                <Separator />

                {approvalResult.signedPdfUrl && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      File hợp đồng
                    </p>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                      onClick={handleDownloadPdf}
                    >
                      <FileText className="h-4 w-4" />
                      <span className="flex-1 text-left text-primary">
                        Hợp đồng thuê nhà - {approvalResult.contractCode}.pdf
                      </span>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <DialogFooter>
            <Button onClick={handleClose} className="w-full">
              Đã hiểu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Dialog xác nhận duyệt và hiển thị PDF preview
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Xác nhận duyệt yêu cầu thuê</DialogTitle>
          <DialogDescription>
            Vui lòng xem xét kỹ thông tin trước khi duyệt. Sau khi duyệt, hợp
            đồng sẽ được tạo và gửi đến khách thuê để ký.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Thông tin khách thuê */}
          <Card className="bg-primary-foreground">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-3">Thông tin khách thuê</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Họ và tên</p>
                  <p className="font-medium">{tenant.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Số điện thoại</p>
                  <p className="font-medium">{tenant.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{tenant.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">CCCD/CMND</p>
                  <p className="font-medium">
                    {tenant.CCCD || "Chưa cập nhật"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Thông tin bất động sản */}
          <Card className="bg-primary-foreground">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-3">Thông tin bất động sản</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Tên tài sản</p>
                  <p className="font-medium">{property.title}</p>
                </div>
                {isBoarding && room && (
                  <div>
                    <p className="text-sm text-muted-foreground">Phòng</p>
                    <p className="font-medium">
                      {room.name} - {room.roomType.name}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Địa chỉ</p>
                  <p className="font-medium">
                    {property.address}, {property.ward}, {property.province}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Giá thuê</p>
                    <p className="font-medium text-primary">
                      {price.toLocaleString("vi-VN")} VNĐ/tháng
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tiền cọc</p>
                    <p className="font-medium text-primary">
                      {deposit.toLocaleString("vi-VN")} VNĐ
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* PDF Preview */}
          <Card className="bg-primary-foreground">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Xem trước hợp đồng
              </h3>
              <div className="border rounded-lg overflow-hidden bg-gray-50">
                <iframe
                  src="/contract/HopDongChoThueNhaNguyenCan.pdf"
                  className="w-full h-[500px]"
                  title="Hợp đồng cho thuê nhà"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                * Đây là mẫu hợp đồng mặc định. Hợp đồng thực tế sẽ được điền
                thông tin cụ thể.
              </p>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={dialogState !== "approval"}
            className="text-primary"
          >
            Hủy
          </Button>
          <Button
            onClick={() => setDialogState("signing-method")}
            disabled={dialogState !== "approval"}
            className="gap-2"
          >
            <CheckCircle2 className="h-4 w-4" />
            Xác nhận duyệt
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Signing Method Dialog */}
      <SigningMethodDialog
        open={dialogState === "signing-method"}
        onOpenChange={(open) => {
          if (!open && dialogState === "signing-method") {
            setDialogState("approval");
          }
        }}
        onConfirm={handleApprove}
        loading={
          dialogState !== "approval" &&
          dialogState !== "signing-method" &&
          dialogState !== "result"
        }
      />
    </Dialog>
  );
}
