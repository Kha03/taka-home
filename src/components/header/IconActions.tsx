/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import { Bell, Heart, Send } from "lucide-react";

export function IconActions() {
  return (
    <div className="flex items-center gap-3">
      <Button variant="default" size="post" className="gap-2">
        <Send className="text-xl" />
        <span>Đăng tin</span>
      </Button>
      <Button variant="golden" size="icon-sm" className="rounded-full">
        <Heart className="text-xl" />
      </Button>
      <div className="relative">
        <Button variant="golden" size="icon-sm" className="rounded-full">
          <Send className="text-xl" />
        </Button>
        {/* Badge for unread messages */}
        <span className="absolute top-[-4px] right-[-4px] w-5 h-5 px-1 flex items-center justify-center text-[12px] font-semibold text-white bg-[#FF0004] rounded-full">
          3
        </span>
      </div>
      <div className="relative">
        <Button variant="golden" size="icon-sm" className="rounded-full">
          <Bell className="text-xl" />
        </Button>
        {/* Badge for unread messages */}
        <span className="absolute top-[-4px] right-[-4px] w-5 h-5 px-1 flex items-center justify-center text-[12px] font-semibold text-white bg-[#FF0004] rounded-full">
          3
        </span>
      </div>
    </div>
  );
}
