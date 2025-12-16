"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { contractService } from "@/lib/api/services/contract";
import { cn } from "@/lib/utils/utils";
import { getApiErrorMessage } from "@/lib/utils/error-handler";

interface ContractTerminationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contractId: string;
  contractEndDate: string; // ISO string format
  onSuccess?: () => void;
}

export function ContractTerminationDialog({
  open,
  onOpenChange,
  contractId,
  contractEndDate,
  onSuccess,
}: ContractTerminationDialogProps) {
  const t = useTranslations("contract");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [reason, setReason] = useState("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [errors, setErrors] = useState<{
    date?: string;
    reason?: string;
  }>({});

  // Calculate min and max dates
  const today = new Date();
  // Tháng kết thúc phải sau ít nhất 1 tháng so với tháng hiện tại
  // Ví dụ: Nếu hiện tại là tháng 11, có thể chọn từ tháng 12 trở đi
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const contractEnd = new Date(contractEndDate);

  // Validate date is after next month and before contract end
  const isDateValid = (date: Date) => {
    const selectedMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const minMonth = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1);
    const maxMonth = new Date(
      contractEnd.getFullYear(),
      contractEnd.getMonth(),
      1
    );

    return selectedMonth >= minMonth && selectedMonth <= maxMonth;
  };

  const validateForm = () => {
    const newErrors: { date?: string; reason?: string } = {};

    if (!selectedDate) {
      newErrors.date = t("pleaseSelectEndMonth");
    } else if (!isDateValid(selectedDate)) {
      newErrors.date = t("invalidEndMonth");
    }

    if (!reason || reason.trim().length < 10) {
      newErrors.reason = t("reasonTooShort");
    } else if (reason.length > 500) {
      newErrors.reason = t("reasonTooLong");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      // Format date to YYYY-MM
      const requestedEndMonth = format(selectedDate!, "yyyy-MM");

      const response = await contractService.createTerminationRequest({
        contractId,
        requestedEndMonth,
        reason: reason.trim(),
      });

      if (response.code === 201) {
        toast.success(t("success", { ns: "common" }), t("terminationSuccess"));
        // Reset form
        setSelectedDate(undefined);
        setReason("");
        setErrors({});
        onOpenChange(false);
        onSuccess?.();
      }
    } catch (error) {
      console.error("Error creating termination request:", error);
      toast.error(
        t("error", { ns: "common" }),
        getApiErrorMessage(error, t("terminationError"))
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] overflow-visible">
        <DialogHeader>
          <DialogTitle>{t("terminationRequest")}</DialogTitle>
          <DialogDescription>{t("terminationDescription")}</DialogDescription>
        </DialogHeader>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{t("terminationNote")}</AlertDescription>
        </Alert>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-semibold">{t("terminationPenaltyWarning")}</p>
              <p className="text-sm">{t("terminationPenaltyNote")}</p>
            </div>
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Picker */}
          <div className="flex flex-col space-y-2">
            <Label>
              {t("desiredEndMonth")}{" "}
              <span className="text-red-500">{t("required")}</span>
            </Label>
            <Popover
              open={isCalendarOpen}
              onOpenChange={setIsCalendarOpen}
              modal={true}
            >
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal text-primary",
                    !selectedDate && "text-muted-foreground"
                  )}
                  onClick={() => setIsCalendarOpen(true)}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? (
                    format(selectedDate, "MMMM yyyy", { locale: vi })
                  ) : (
                    <span>{t("selectEndMonth")}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 z-[9999]"
                align="start"
                side="bottom"
                sideOffset={4}
                style={{
                  zIndex: 9999,
                  pointerEvents: "auto",
                }}
                onOpenAutoFocus={(e) => {
                  e.preventDefault();
                }}
                onInteractOutside={(e) => {
                  const target = e.target as HTMLElement;
                  if (!target.closest('[role="dialog"]')) {
                    setIsCalendarOpen(false);
                  } else {
                    e.preventDefault();
                  }
                }}
              >
                <div className="bg-white rounded-md">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      if (date) {
                        setSelectedDate(date);
                        setTimeout(() => {
                          setIsCalendarOpen(false);
                        }, 100);
                      }
                    }}
                    onDayClick={(day, modifiers) => {
                      if (!modifiers.disabled) {
                        setSelectedDate(day);
                        setTimeout(() => {
                          setIsCalendarOpen(false);
                        }, 100);
                      }
                    }}
                    disabled={(date) => !isDateValid(date)}
                    initialFocus={false}
                    locale={vi}
                  />
                </div>
              </PopoverContent>
            </Popover>
            <p className="text-sm text-muted-foreground">
              {t("selectMonthHelp")}
            </p>
            {errors.date && (
              <p className="text-sm text-red-500">{errors.date}</p>
            )}
          </div>

          {/* Reason Textarea */}
          <div className="flex flex-col space-y-2">
            <Label>
              {t("terminationReason")}{" "}
              <span className="text-red-500">{t("required")}</span>
            </Label>
            <Textarea
              placeholder={t("terminationReasonPlaceholder")}
              className="min-h-[120px] resize-none"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              {t("terminationReasonHelp")}
            </p>
            {errors.reason && (
              <p className="text-sm text-red-500">{errors.reason}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="text-primary"
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t("sending") : t("sendRequest")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
