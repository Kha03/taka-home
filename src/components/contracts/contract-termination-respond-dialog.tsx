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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { contractService } from "@/lib/api/services/contract";
import { ContractTermination } from "@/types/contracts";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface ContractTerminationRespondDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  termination: ContractTermination;
  onSuccess?: () => void;
}

export function ContractTerminationRespondDialog({
  open,
  onOpenChange,
  termination,
  onSuccess,
}: ContractTerminationRespondDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseNote, setResponseNote] = useState("");
  const [selectedAction, setSelectedAction] = useState<
    "APPROVED" | "REJECTED" | null
  >(null);

  const handleSubmit = async (status: "APPROVED" | "REJECTED") => {
    try {
      setIsSubmitting(true);

      const response = await contractService.respondToTerminationRequest(
        termination.id,
        {
          status,
          responseNote: responseNote.trim(),
        }
      );

      if (response.code === 200) {
        toast.success(
          "Thành công",
          status === "APPROVED"
            ? "Đã chấp nhận yêu cầu hủy hợp đồng"
            : "Đã từ chối yêu cầu hủy hợp đồng"
        );
        setResponseNote("");
        setSelectedAction(null);
        onOpenChange(false);
        onSuccess?.();
      }
    } catch (error) {
      console.error("Error responding to termination request:", error);
      toast.error(
        "Lỗi",
        error instanceof Error
          ? error.message
          : "Không thể phản hồi yêu cầu hủy hợp đồng"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Phản hồi yêu cầu hủy hợp đồng</DialogTitle>
          <DialogDescription>
            Xem xét và phản hồi yêu cầu hủy hợp đồng trước hạn từ{" "}
            {termination.requestedBy.fullName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Request Information */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p>
                  <strong>Tháng kết thúc mong muốn:</strong>{" "}
                  {format(
                    new Date(termination.requestedEndMonth + "-01"),
                    "MMMM yyyy",
                    { locale: vi }
                  )}
                </p>
                <p>
                  <strong>Lý do:</strong> {termination.reason}
                </p>
              </div>
            </AlertDescription>
          </Alert>

          {/* Response Note */}
          <div className="flex flex-col space-y-2">
            <Label>Ghi chú phản hồi (không bắt buộc)</Label>
            <Textarea
              placeholder="Thêm ghi chú về quyết định của bạn..."
              className="min-h-[100px] resize-none"
              value={responseNote}
              onChange={(e) => setResponseNote(e.target.value)}
              maxLength={500}
            />
            <p className="text-sm text-muted-foreground">
              Bạn có thể thêm ghi chú để giải thích quyết định của mình
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="border-red-500 text-red-600 hover:bg-red-50"
              onClick={() => setSelectedAction("REJECTED")}
              disabled={isSubmitting}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Từ chối
            </Button>
            <Button
              variant="outline"
              className="border-green-500 text-green-600 hover:bg-green-50"
              onClick={() => setSelectedAction("APPROVED")}
              disabled={isSubmitting}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Chấp nhận
            </Button>
          </div>

          {/* Confirmation Alert */}
          {selectedAction && (
            <Alert
              variant={
                selectedAction === "APPROVED" ? "default" : "destructive"
              }
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {selectedAction === "APPROVED" ? (
                  <>
                    Bạn có chắc chắn muốn <strong>chấp nhận</strong> yêu cầu hủy
                    hợp đồng này? Hợp đồng sẽ kết thúc vào tháng{" "}
                    {format(
                      new Date(termination.requestedEndMonth + "-01"),
                      "MM/yyyy",
                      { locale: vi }
                    )}
                    .
                  </>
                ) : (
                  <>
                    Bạn có chắc chắn muốn <strong>từ chối</strong> yêu cầu hủy
                    hợp đồng này? Hợp đồng sẽ tiếp tục theo thời hạn ban đầu.
                  </>
                )}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          {/* <Button
            type="button"
            variant="outline"
            onClick={() => {
              setSelectedAction(null);
              onOpenChange(false);
            }}
            disabled={isSubmitting}
          >
            Đóng
          </Button> */}
          {selectedAction && (
            <Button
              onClick={() => handleSubmit(selectedAction)}
              disabled={isSubmitting}
              variant={
                selectedAction === "APPROVED" ? "default" : "destructive"
              }
            >
              {isSubmitting
                ? "Đang xử lý..."
                : selectedAction === "APPROVED"
                ? "Xác nhận chấp nhận"
                : "Xác nhận từ chối"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
