"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ChatListItemProps } from "@/types/chat";
import { MessageCircle, Search } from "lucide-react";
import Image from "next/image";
import React from "react";

interface ChatListProps {
  chats: ChatListItemProps["chat"][];
  activeChat: ChatListItemProps["chat"] | null;
  onChatSelect: (chat: ChatListItemProps["chat"]) => void;
  currentUserId: string;
  isLoading?: boolean;
}

function ChatListItem({
  chat,
  isActive,
  onClick,
  currentUserId,
}: ChatListItemProps) {
  const otherParticipant = chat.participants.find(
    (p) => p.id !== currentUserId
  );

  const formatLastMessageTime = (timestamp?: Date) => {
    if (!timestamp) return "";

    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Vừa xong";
    if (minutes < 60) return `${minutes} phút`;
    if (hours < 24) return `${hours} giờ`;
    if (days < 7) return `${days} ngày`;

    return timestamp.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  const truncateMessage = (message: string, maxLength: number = 50) => {
    return message.length > maxLength
      ? `${message.substring(0, maxLength)}...`
      : message;
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100",
        isActive && "bg-[#DCBB87]/10 border-[#DCBB87]/20"
      )}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <Avatar className="w-12 h-12">
          <AvatarImage
            src={otherParticipant?.avatar}
            alt={otherParticipant?.name}
          />
          <AvatarFallback className="bg-[#DCBB87] text-white">
            {otherParticipant?.name?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        {/* Online indicator */}
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
      </div>

      {/* Chat info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-medium text-gray-900 truncate">
            {otherParticipant?.name || "Unknown User"}
          </h4>
          <span className="text-xs text-gray-500 flex-shrink-0">
            {formatLastMessageTime(chat.lastMessage?.timestamp)}
          </span>
        </div>

        {/* Property info */}
        {chat.propertyTitle && (
          <div className="flex items-center gap-2 mb-1">
            {chat.propertyImage && (
              <div className="w-6 h-6 rounded overflow-hidden flex-shrink-0">
                <Image
                  src={chat.propertyImage}
                  alt="Property"
                  width={24}
                  height={24}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <span className="text-xs text-gray-600 truncate">
              {chat.propertyTitle}
            </span>
          </div>
        )}

        {/* Last message */}
        <div className="flex items-center justify-between">
          <p
            className={cn(
              "text-sm truncate",
              chat.unreadCount > 0
                ? "font-medium text-gray-900"
                : "text-gray-600"
            )}
          >
            {chat.lastMessage?.sender?.id === currentUserId
              ? "Bạn:"
              : (chat.lastMessage?.sender?.fullName ?? "") + " "}
            {chat.lastMessage
              ? truncateMessage(chat.lastMessage.content)
              : "Bắt đầu cuộc trò chuyện"}
          </p>

          {/* Unread badge */}
          {chat.unreadCount > 0 && (
            <Badge className="bg-[#FF0004] text-white text-xs min-w-[1.25rem] h-5 flex items-center justify-center rounded-full">
              {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

export function ChatList({
  chats,
  activeChat,
  onChatSelect,
  currentUserId,
  isLoading = false,
}: ChatListProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredChats = React.useMemo(() => {
    if (!searchQuery.trim()) return chats;

    return chats.filter((chat) => {
      const otherParticipant = chat.participants.find(
        (p) => p.id !== currentUserId
      );
      const participantName = otherParticipant?.name?.toLowerCase() || "";
      const propertyTitle = chat.propertyTitle?.toLowerCase() || "";
      const lastMessage = chat.lastMessage?.content?.toLowerCase() || "";
      const query = searchQuery.toLowerCase();

      return (
        participantName.includes(query) ||
        propertyTitle.includes(query) ||
        lastMessage.includes(query)
      );
    });
  }, [chats, searchQuery, currentUserId]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#DCBB87] mx-auto mb-2"></div>
          <p className="text-sm text-gray-500">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-[#DCBB87]" />
            Tin nhắn
          </h2>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Tìm kiếm cuộc trò chuyện..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-gray-300 focus:border-[#DCBB87] focus:ring-[#DCBB87]"
          />
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="h-full flex items-center justify-center p-4">
            <div className="text-center">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">
                {searchQuery
                  ? "Không tìm thấy cuộc trò chuyện nào"
                  : "Chưa có cuộc trò chuyện nào"}
              </p>
            </div>
          </div>
        ) : (
          <div>
            {filteredChats.map((chat) => (
              <ChatListItem
                key={chat.id}
                chat={chat}
                isActive={activeChat?.id === chat.id}
                onClick={() => onChatSelect(chat)}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
