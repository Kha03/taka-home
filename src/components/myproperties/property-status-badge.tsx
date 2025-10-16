import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/utils";

interface PropertyStatusBadgeProps {
  status: "Đang cho thuê" | "Trống" | string;
  className?: string;
}

export function PropertyStatusBadge({
  status,
  className,
}: PropertyStatusBadgeProps) {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Đang cho thuê":
        return {
          bg: "bg-[#00AE26]",
          text: "text-white",
        };
      case "Trống":
        return {
          bg: "bg-gray-500",
          text: "text-white",
        };
      default:
        return {
          bg: "bg-gray-500",
          text: "text-white",
        };
    }
  };

  const styles = getStatusStyles(status);

  return (
    <Badge
      className={cn(
        "absolute top-0 left-0 text-xs font-bold pointer-events-none select-none rounded-none rounded-tl-[8px] rounded-br-[8px]",
        styles.bg,
        styles.text,
        className
      )}
      style={{ cursor: "default" }}
    >
      {status}
    </Badge>
  );
}
