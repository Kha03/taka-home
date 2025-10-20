import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Send, MessageCircle } from "lucide-react";
import { NotificationBell } from "@/components/notifications";

export function IconActions() {
  return (
    <div className="flex items-center gap-3">
      <Button variant="golden" size="icon-sm" className="rounded-full">
        <Heart className="text-xl" />
      </Button>
      <div className="relative">
        <Link href="/chat">
          <Button variant="golden" size="icon-sm" className="rounded-full">
            <MessageCircle className="text-xl" />
          </Button>
        </Link>
        {/* Badge for unread messages */}
        <span className="absolute top-[-4px] right-[-4px] w-5 h-5 px-1 flex items-center justify-center text-[12px] font-semibold text-white bg-[#FF0004] rounded-full">
          3
        </span>
      </div>
      <NotificationBell className="rounded-full" />
    </div>
  );
}
