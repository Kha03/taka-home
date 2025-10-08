"use client";

import React, { useState } from "react";
import { ChatProvider, useChat } from "@/contexts/chat-context";
import { ChatList, ChatWindow } from "@/components/chat";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Mock current user - trong thực tế sẽ lấy từ auth context
const mockCurrentUser = {
  id: "1",
  name: "Nguyễn Văn An",
  avatar: "/assets/imgs/avatar.png",
  role: "landlord" as const,
  email: "an@example.com",
  phone: "0123456789",
};

function ChatPageContent() {
  const { chats, activeChat, messages, isLoading, setActiveChat, sendMessage } =
    useChat();

  const [showChatWindow, setShowChatWindow] = useState(false);

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
              currentUserId={mockCurrentUser.id}
              isLoading={isLoading}
            />
          </div>

          {/* Chat Window - Hidden on mobile when no chat is selected */}
          <div className={cn("flex-1", !showChatWindow && "hidden md:block")}>
            <ChatWindow
              chat={activeChat}
              messages={messages}
              currentUser={mockCurrentUser}
              onSendMessage={handleSendMessage}
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
  return (
    <ChatProvider currentUserId={mockCurrentUser.id}>
      <ChatPageContent />
    </ChatProvider>
  );
}
