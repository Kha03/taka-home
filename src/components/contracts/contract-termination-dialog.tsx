"use client";

import { useState } from "react";
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
      newErrors.date = "Vui lòng chọn tháng kết thúc";
    } else if (!isDateValid(selectedDate)) {
      newErrors.date = "Thời gian kết thúc không hợp lệ";
    }

    if (!reason || reason.trim().length < 10) {
      newErrors.reason = "Lý do phải có ít nhất 10 ký tự";
    } else if (reason.length > 500) {
      newErrors.reason = "Lý do không được vượt quá 500 ký tự";
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
        toast.success(
          "Thành công",
          "Yêu cầu hủy hợp đồng đã được gửi thành công"
        );
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
        "Lỗi",
        getApiErrorMessage(error, "Không thể gửi yêu cầu hủy hợp đồng")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] overflow-visible">
        <DialogHeader>
          <DialogTitle>Yêu cầu hủy hợp đồng trước hạn</DialogTitle>
          <DialogDescription>
            Gửi yêu cầu hủy hợp đồng trước thời hạn. Bên còn lại sẽ nhận được
            thông báo và có thể chấp nhận hoặc từ chối yêu cầu của bạn.
          </DialogDescription>
        </DialogHeader>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Lưu ý:</strong> Thời gian kết thúc phải sau ít nhất 1 tháng
            so với tháng hiện tại và không được vượt quá thời hạn hợp đồng (
            {format(contractEnd, "MM/yyyy", { locale: vi })}).
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Picker */}
          <div className="flex flex-col space-y-2">
            <Label>
              Tháng kết thúc mong muốn <span className="text-red-500">*</span>
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
                    <span>Chọn tháng kết thúc</span>
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
              Chọn tháng mà bạn muốn kết thúc hợp đồng (sau ít nhất 1 tháng)
            </p>
            {errors.date && (
              <p className="text-sm text-red-500">{errors.date}</p>
            )}
          </div>

          {/* Reason Textarea */}
          <div className="flex flex-col space-y-2">
            <Label>
              Lý do hủy hợp đồng <span className="text-red-500">*</span>
            </Label>
            <Textarea
              placeholder="Vui lòng cho biết lý do bạn muốn hủy hợp đồng trước hạn..."
              className="min-h-[120px] resize-none"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Giải thích rõ lý do để bên kia có thể xem xét (10-500 ký tự)
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
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
