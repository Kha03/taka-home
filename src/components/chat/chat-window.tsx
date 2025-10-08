"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Chat, Message, User } from "@/types/chat";
import {
  ArrowLeft,
  Info,
  MapPin,
  MessageCircle,
  MoreVertical,
  Star,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { MessageBubble } from "./message-bubble";
import { MessageInput } from "./message-input";

interface ChatWindowProps {
  chat: Chat | null;
  messages: Message[];
  currentUser: User;
  onSendMessage: (content: string, type?: Message["type"]) => void;
  onBack?: () => void;
  isLoading?: boolean;
  className?: string;
}

export function ChatWindow({
  chat,
  messages,
  currentUser,
  onSendMessage,
  onBack,
  isLoading = false,
  className,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!chat) {
    return (
      <div
        className={cn(
          "h-full flex items-center justify-center bg-gray-50",
          className
        )}
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-[#DCBB87]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 text-[#DCBB87]">
              <MessageCircle className="w-8 h-8" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Chọn một cuộc trò chuyện
          </h3>
          <p className="text-gray-500">
            Chọn một cuộc trò chuyện từ danh sách để bắt đầu nhắn tin
          </p>
        </div>
      </div>
    );
  }

  const otherParticipant = chat.participants.find(
    (p) => p.id !== currentUser.id
  );

  return (
    <div className={cn("h-full flex flex-col bg-white", className)}>
      <div ref={messagesEndRef} />

      {/* Header */}
      <div className="flex-shrink-0 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3 p-4">
          {/* Back button for mobile */}
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="md:hidden text-gray-500"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}

          {/* User info */}
          <div className="flex items-center gap-3 flex-1">
            <div className="relative">
              <Avatar className="w-10 h-10">
                <AvatarImage
                  src={otherParticipant?.avatar}
                  alt={otherParticipant?.name}
                />
                <AvatarFallback className="bg-[#DCBB87] text-white">
                  {otherParticipant?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              {/* Online status */}
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-gray-900 truncate">
                  {otherParticipant?.name || "Unknown User"}
                </h3>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs",
                    otherParticipant?.role === "landlord"
                      ? "border-[#DCBB87] text-[#DCBB87]"
                      : "border-blue-500 text-blue-500"
                  )}
                >
                  {otherParticipant?.role === "landlord"
                    ? "Chủ nhà"
                    : "Người thuê"}
                </Badge>
              </div>
              <p className="text-sm text-green-500">Đang hoạt động</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="text-gray-500">
              <Info className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-500">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Property info banner */}
        {chat.propertyTitle && (
          <div className="px-4 pb-3">
            <div className="bg-[#DCBB87]/10 rounded-lg p-3 border border-[#DCBB87]/20">
              <div className="flex items-center gap-3">
                {chat.propertyImage && (
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={chat.propertyImage}
                      alt="Property"
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">
                    {chat.propertyTitle}
                  </h4>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="w-3 h-3" />
                    <span>Quận 1, TP.HCM</span>
                    <div className="flex items-center gap-1 ml-2">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>4.8</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#DCBB87] text-[#DCBB87]"
                >
                  Xem chi tiết
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-1"
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#DCBB87] mx-auto mb-2"></div>
              <p className="text-sm text-gray-500">Đang tải tin nhắn...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#DCBB87]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-2xl">👋</div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Bắt đầu cuộc trò chuyện
              </h3>
              <p className="text-gray-500">
                Gửi tin nhắn đầu tiên để bắt đầu trò chuyện với{" "}
                {otherParticipant?.name}
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => {
              const isOwn = message.senderId === currentUser.id;
              const user = isOwn ? currentUser : otherParticipant;
              const previousMessage = messages[index - 1];
              const showAvatar =
                !previousMessage ||
                previousMessage.senderId !== message.senderId ||
                message.timestamp.getTime() -
                  previousMessage.timestamp.getTime() >
                  5 * 60 * 1000; // 5 minutes

              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwn={isOwn}
                  user={user}
                  showAvatar={showAvatar}
                />
              );
            })}
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="flex-shrink-0">
        <MessageInput
          onSend={onSendMessage}
          disabled={isLoading}
          placeholder={`Nhắn tin cho ${otherParticipant?.name}...`}
        />
      </div>
    </div>
  );
}
