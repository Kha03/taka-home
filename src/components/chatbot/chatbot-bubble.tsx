"use client";

import React from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/utils";

interface ChatbotBubbleProps {
  isOpen: boolean;
  onToggle: () => void;
  unreadCount?: number;
}

export function ChatbotBubble({
  isOpen,
  onToggle,
  unreadCount = 0,
}: ChatbotBubbleProps) {
  return (
    <Button
      onClick={onToggle}
      className={cn(
        "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110",
        isOpen
          ? "bg-destructive hover:bg-destructive/90"
          : "bg-primary hover:bg-primary/90"
      )}
      aria-label={isOpen ? "Đóng chatbot" : "Mở chatbot"}
    >
      {isOpen ? (
        <X className="h-6 w-6" />
      ) : (
        <>
          <MessageCircle className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </>
      )}
    </Button>
  );
}
