"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
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
import { getApiErrorMessage } from "@/lib/utils/error-handler";

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
  const t = useTranslations("contract");
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
        getApiErrorMessage(error, "Không thể phản hồi yêu cầu hủy hợp đồng")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t("respondToTermination")}</DialogTitle>
          <DialogDescription>
            {t("respondDescription", {
              name: termination.requestedBy.fullName,
            })}
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
            <Label>{t("responseNote")}</Label>
            <Textarea
              placeholder={t("responseNotePlaceholder")}
              className="min-h-[100px] resize-none"
              value={responseNote}
              onChange={(e) => setResponseNote(e.target.value)}
              maxLength={500}
            />
            <p className="text-sm text-muted-foreground">
              {t("responseNoteHelp")}
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
              {t("reject")}
            </Button>
            <Button
              variant="outline"
              className="border-green-500 text-green-600 hover:bg-green-50"
              onClick={() => setSelectedAction("APPROVED")}
              disabled={isSubmitting}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              {t("accept")}
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
                    {t("confirmAccept", {
                      month: format(
                        new Date(termination.requestedEndMonth + "-01"),
                        "MM/yyyy",
                        { locale: vi }
                      ),
                    })}
                  </>
                ) : (
                  <>{t("confirmReject")}</>
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
                ? t("processing")
                : selectedAction === "APPROVED"
                ? t("confirmAcceptButton")
                : t("confirmRejectButton")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
