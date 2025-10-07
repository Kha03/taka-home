import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PropertyRoomBadgeProps {
  roomCode: string;
  isRented: boolean;
}

export function PropertyRoomBadge({
  roomCode,
  isRented,
}: PropertyRoomBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "font-semibold text-sm cursor-default",
        isRented
          ? "bg-[#00AE26]/20 text-[#00AE26] hover:bg-[#00AE26]/30 border-[#00AE26]/30"
          : "bg-accent/25 text-secondary hover:bg-accent/35 border-accent/40"
      )}
    >
      {roomCode}
    </Badge>
  );
}
