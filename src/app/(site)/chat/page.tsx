"use client";

import React, { useState, useEffect } from "react";
import { ChatProvider, useChat } from "@/contexts/chat-context";
import { useAuth } from "@/contexts/auth-context";
import { ChatList, ChatWindow } from "@/components/chat";
import { cn } from "@/lib/utils/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";

function ChatPageContent() {
  const {
    chats,
    activeChat,
    messages,
    isLoading,
    typingUsers,
    setActiveChat,
    sendMessage,
    sendTypingIndicator,
  } = useChat();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId");

  const [showChatWindow, setShowChatWindow] = useState(false);
  const [hasAutoSelected, setHasAutoSelected] = useState(false);

  // Auto-select chat based on roomId from URL
  useEffect(() => {
    if (roomId && chats.length > 0 && !hasAutoSelected) {
      const chatToSelect = chats.find((chat) => chat.id === roomId);
      if (chatToSelect) {
        setActiveChat(chatToSelect);
        setShowChatWindow(true);
        setHasAutoSelected(true);
      }
    }
  }, [roomId, chats, hasAutoSelected, setActiveChat]);

  if (!user) {
    return (
      <div className="h-screen bg-[#FFF7E9] flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-4">Vui lòng đăng nhập để sử dụng chat</p>
          <Link href="/signin">
            <Button>Đăng nhập</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Convert auth user to chat user format
  const currentUser = {
    id: user.id,
    name: user.name,
    avatar: user.avatar || "/assets/imgs/avatar.png",
    role: "tenant" as const, // You can determine this from user data if available
    email: user.email,
    phone: "",
  };

  const handleChatSelect = (chat: typeof activeChat) => {
    setActiveChat(chat);
    setShowChatWindow(true);
  };

  const handleBack = () => {
    setShowChatWindow(false);
    setActiveChat(null);
  };

  const handleSendMessage = async (
    content: string,
    type?: "text" | "image" | "file"
  ) => {
    await sendMessage(content, type);
  };

  return (
    <div className="h-screen bg-[#FFF7E9] pt-4">
      {/* Main content */}
      <div className="max-w-7xl mx-auto h-[calc(100vh-88px)]">
        <Link href="/">
          <Button variant="link" className="ml-6 mb-2">
            <ArrowLeft className="mr-1" />
            Quay lại
          </Button>
        </Link>
        <div className="flex h-full bg-white shadow-sm rounded-lg overflow-hidden mx-6">
          {/* Chat List - Hidden on mobile when chat is active */}
          <div
            className={cn(
              "w-full md:w-80 border-r border-gray-200 flex-shrink-0",
              showChatWindow && "hidden md:block"
            )}
          >
            <ChatList
              chats={chats}
              activeChat={activeChat}
              onChatSelect={handleChatSelect}
              currentUserId={user.id}
              isLoading={isLoading}
            />
          </div>

          {/* Chat Window - Hidden on mobile when no chat is selected */}
          <div className={cn("flex-1", !showChatWindow && "hidden md:block")}>
            <ChatWindow
              chat={activeChat}
              messages={messages}
              currentUser={currentUser}
              typingUsers={typingUsers}
              onSendMessage={handleSendMessage}
              onTyping={sendTypingIndicator}
              onBack={handleBack}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="h-screen bg-[#FFF7E9] flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-4">Vui lòng đăng nhập để sử dụng chat</p>
          <Link href="/signin">
            <Button>Đăng nhập</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ChatProvider currentUserId={user.id}>
      <ChatPageContent />
    </ChatProvider>
  );
}
