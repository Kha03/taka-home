"use client";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Calendar, Clock, Info } from "lucide-react";
import { cn } from "@/lib/utils/utils";

interface ContractExpiryAlertProps {
  endDate: string;
  daysRemaining: number;
  onExtendClick: () => void;
  className?: string;
}

export function ContractExpiryAlert({
  endDate,
  daysRemaining,
  onExtendClick,
  className,
}: ContractExpiryAlertProps) {
  const getAlertConfig = () => {
    if (daysRemaining <= 30) {
      return {
        icon: <Clock className="h-5 w-5" />,
        title: "Hợp đồng sắp hết hạn!",
        bgClass: "bg-red-50 border-red-200",
        textClass: "text-red-800 dark:text-red-200",
        buttonClass: "bg-red-600 hover:bg-red-700 text-primary-foreground",
      };
    }
    if (daysRemaining <= 45) {
      return {
        icon: <Calendar className="h-5 w-5" />,
        title: "Nhắc nhở gia hạn hợp đồng",
        bgClass:
          "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800",
        textClass: "text-amber-800 dark:text-amber-200",
        buttonClass: "bg-amber-600 hover:bg-amber-700 text-primary-foreground",
      };
    }
    return {
      icon: <Info className="h-5 w-5" />,
      title: "Thông tin gia hạn",
      bgClass: "bg-primary/10 border-primary",
      textClass: "text-primary",
      buttonClass: "bg-primary hover:bg-primary/80 text-primary-foreground",
    };
  };

  const config = getAlertConfig();

  return (
    <Alert className={cn(config.bgClass, "border-l-4", className)}>
      <div className="flex items-start gap-4">
        <div className={cn("flex-shrink-0 mt-0.5", config.textClass)}>
          {config.icon}
        </div>
        <div className="flex-1 space-y-2">
          <AlertTitle
            className={cn("text-base font-semibold", config.textClass)}
          >
            {config.title}
          </AlertTitle>
          <AlertDescription
            className={cn("text-sm space-y-1", config.textClass)}
          >
            <p>
              Hợp đồng của bạn sẽ hết hạn vào ngày
              <span className="font-semibold"> {endDate}</span> ({daysRemaining}{" "}
              ngày nữa).
            </p>
            <p>
              Bạn có muốn gửi yêu cầu gia hạn hợp đồng không? Chủ nhà sẽ xem xét
              và phản hồi yêu cầu của bạn.
            </p>
          </AlertDescription>
          <div className="pt-1">
            <Button
              onClick={onExtendClick}
              size="sm"
              className={cn(config.buttonClass, "gap-2")}
            >
              <Calendar className="h-4 w-4" />
              Gửi yêu cầu gia hạn
            </Button>
          </div>
        </div>
      </div>
    </Alert>
  );
}
