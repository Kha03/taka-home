import { cn } from "@/lib/utils/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Check, X } from "lucide-react";
import { Button } from "../ui/button";

interface RentalRequestStatusProps {
  user: {
    name: string;
    avatar: string;
    phone?: string;
  };
  status: "pending" | "approved" | "rejected";
  reason?: string;
  timestamp: string;
  onApprove?: () => void;
  onReject?: () => void;
}

export function RentalRequestStatus({
  user,
  status,
  reason,
  timestamp,
  onApprove,
  onReject,
}: RentalRequestStatusProps) {
  const isRejected = status === "rejected";
  const isPending = status === "pending";

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-[50px] p-2",
        isRejected
          ? "bg-[#FA0000]/10"
          : isPending
          ? "bg-[#818181]/10"
          : "bg-[#00AE26]/20"
      )}
    >
      <Avatar className="w-9 h-9 ml-2 flex items-center justify-center rounded-full overflow-hidden">
        <AvatarImage
          className="w-full h-full object-cover"
          src={user.avatar}
          alt={user.name}
        />
        <AvatarFallback className="text-sm">
          {user.name.charAt(0)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <div className="flex items-center gap-3">
          <p className="font-bold text-primary text-sm">{user.name}</p>
          <span className="text-xs text-accent">
            Số điện thoại:
            <span className="text-primary font-bold"> {user.phone}</span>
          </span>
        </div>

        <div className="flex items-center gap-3 mt-1">
          <p
            className={cn(
              "text-sm",
              isRejected ? "text-red-600" : "text-[#4F4F4F]"
            )}
          >
            {isPending
              ? "Đã gửi yêu cầu thuê"
              : isRejected
              ? "Đã từ chối yêu cầu thuê"
              : "Đã chấp nhận yêu cầu thuê"}
          </p>
          <span className="text-xs text-[#C0C0C0]">{timestamp}</span>
        </div>
      </div>

      {isPending && (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onReject}
            className="hover:bg-red-600/10 rounded-[30px] text-xs"
          >
            <X className="w-3 h-3" />
            Từ chối
          </Button>
          <Button
            size="sm"
            onClick={onApprove}
            className="text-primary-foreground rounded-[30px] text-xs"
          >
            <Check className="w-3 h-3" />
            Đồng ý
          </Button>
        </div>
      )}
      {isRejected && reason && (
        <p className="mt-1 text-sm text-popover">
          <strong className="font-bold">Lý do từ chối:</strong> {reason}
        </p>
      )}
    </div>
  );
}
