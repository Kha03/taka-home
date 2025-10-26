"use client";

import React, { useEffect, useRef } from "react";
import { X, RotateCcw, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatbotMessage } from "./chatbot-message";
import { ChatbotInput } from "./chatbot-input";
import type { ChatMessage } from "@/types/chatbot";
import { cn } from "@/lib/utils/utils";

interface ChatbotWindowProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  onReset: () => void;
  isLoading: boolean;
}

export function ChatbotWindow({
  isOpen,
  onClose,
  messages,
  onSendMessage,
  onReset,
  isLoading,
}: ChatbotWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "fixed bottom-24 right-6 z-40 w-[400px] max-w-[calc(100vw-3rem)]",
        "bg-background rounded-2xl shadow-2xl border border-border",
        "flex flex-col h-[600px] max-h-[calc(100vh-8rem)]",
        "animate-in slide-in-from-bottom-4 fade-in duration-300"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-base">Trợ lý Taka Home</h3>
            <p className="text-xs text-primary-foreground/80">
              Luôn sẵn sàng hỗ trợ bạn
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onReset}
            className="text-primary-foreground hover:bg-primary-foreground/20"
            title="Làm mới hội thoại"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            className="text-primary-foreground hover:bg-primary-foreground/20"
            title="Đóng"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-primary" />
            </div>
            <h4 className="text-lg font-semibold mb-2">
              Chào mừng bạn đến với Taka Home!
            </h4>
            <p className="text-sm text-muted-foreground max-w-xs">
              Hãy cho tôi biết bạn đang tìm kiếm loại bất động sản nào. Tôi sẽ
              giúp bạn tìm được nơi hoàn hảo!
            </p>
            <div className="mt-6 space-y-2 w-full max-w-xs">
              <button
                onClick={() =>
                  onSendMessage(
                    "Tôi muốn tìm chung cư 2 phòng ngủ ở Hà Nội giá từ 3-5 triệu"
                  )
                }
                className="w-full p-3 text-sm text-left rounded-lg border border-border hover:bg-muted transition-colors"
              >
                💡 Tìm chung cư 2 phòng ngủ ở Hà Nội
              </button>
              <button
                onClick={() =>
                  onSendMessage("Tôi muốn tìm nhà nguyên căn ở TP.HCM")
                }
                className="w-full p-3 text-sm text-left rounded-lg border border-border hover:bg-muted transition-colors"
              >
                🏠 Tìm nhà nguyên căn ở TP.HCM
              </button>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <ChatbotMessage
                key={msg.id}
                type={msg.type}
                content={msg.content}
                timestamp={msg.timestamp}
                isLoading={msg.isLoading}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <ChatbotInput
        onSendMessage={onSendMessage}
        isLoading={isLoading}
        placeholder="Nhập câu hỏi của bạn..."
      />
    </div>
  );
}
