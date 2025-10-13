"use client";

import React from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageBubbleProps } from "@/types/chat";
import { cn } from "@/lib/utils";
import { Check, CheckCheck, Clock } from "lucide-react";

export function MessageBubble({
  message,
  isOwn,
  showAvatar = true,
  user,
}: MessageBubbleProps) {
  const formatTime = (timestamp: Date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(timestamp);
  };

  const getStatusIcon = () => {
    switch (message.status) {
      case "sent":
        return <Clock className="w-3 h-3" />;
      case "delivered":
        return <Check className="w-3 h-3" />;
      case "read":
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "flex items-end gap-2 mb-4",
        isOwn ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar hoặc placeholder - cho cả tin nhắn người khác và của mình */}
      {showAvatar ? (
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src={user?.avatar} alt={user?.name} />
          <AvatarFallback className="bg-[#DCBB87] text-white text-sm">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      ) : (
        // Placeholder invisible để giữ spacing
        <div className="w-8 h-8 flex-shrink-0" />
      )}

      <div
        className={cn(
          "flex flex-col max-w-[70%]",
          isOwn ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "relative px-4 py-2 rounded-2xl break-words",
            isOwn
              ? "bg-[#DCBB87] text-white rounded-br-md"
              : "bg-white border border-gray-200 text-gray-900 rounded-bl-md"
          )}
        >
          {message.type === "text" && (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          )}

          {message.type === "image" && (
            <div className="space-y-2">
              {message.content && (
                <p className="text-sm leading-relaxed">{message.content}</p>
              )}
              {message.attachments?.map(
                (attachment) =>
                  attachment.type === "image" && (
                    <div
                      key={attachment.id}
                      className="relative w-full max-w-sm"
                    >
                      <Image
                        src={attachment.url}
                        alt={attachment.name}
                        width={300}
                        height={200}
                        className="w-full h-auto rounded-lg object-cover"
                      />
                    </div>
                  )
              )}
            </div>
          )}

          {message.type === "file" && (
            <div className="space-y-2">
              {message.content && (
                <p className="text-sm leading-relaxed">{message.content}</p>
              )}
              {message.attachments?.map((attachment) => (
                <div
                  key={attachment.id}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-lg",
                    isOwn ? "bg-white/20" : "bg-gray-50"
                  )}
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium truncate">
                      {attachment.name}
                    </p>
                    <p
                      className={cn(
                        "text-xs",
                        isOwn ? "text-white/70" : "text-gray-500"
                      )}
                    >
                      {(attachment.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          className={cn(
            "flex items-center gap-1 mt-1 text-xs text-gray-500",
            isOwn ? "flex-row-reverse" : "flex-row"
          )}
        >
          <span>{formatTime(message.timestamp)}</span>
          {isOwn && getStatusIcon()}
        </div>
      </div>
    </div>
  );
}
