"use client";

import React, { useState, useCallback } from "react";
import { ChatbotBubble } from "./chatbot-bubble";
import { ChatbotWindow } from "./chatbot-window";
import type { ChatMessage } from "@/types/chatbot";
import { chatbotService } from "@/lib/api/services/chatbot";
import { toast } from "@/hooks/use-toast";

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleSendMessage = useCallback(
    async (content: string) => {
      // Add user message
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        type: "user",
        content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      // Add loading bot message
      const loadingMessage: ChatMessage = {
        id: `${Date.now()}-loading`,
        type: "bot",
        content: "",
        timestamp: new Date(),
        isLoading: true,
      };

      setMessages((prev) => [...prev, loadingMessage]);

      try {
        const response = await chatbotService.sendMessage(content);

        if (response.code === 200 && response.data?.response) {
          // Remove loading message and add real response
          setMessages((prev) => {
            const filtered = prev.filter((msg) => msg.id !== loadingMessage.id);
            const botMessage: ChatMessage = {
              id: `${Date.now()}-bot`,
              type: "bot",
              content: response.data!.response,
              timestamp: new Date(),
            };
            return [...filtered, botMessage];
          });
        } else {
          throw new Error(response.message || "Có lỗi xảy ra");
        }
      } catch (error) {
        // Remove loading message
        setMessages((prev) =>
          prev.filter((msg) => msg.id !== loadingMessage.id)
        );

        const errorMessage =
          error instanceof Error
            ? error.message
            : "Không thể kết nối đến server";

        toast.error("Lỗi", errorMessage);

        // Add error message
        const errorBotMessage: ChatMessage = {
          id: `${Date.now()}-error`,
          type: "bot",
          content: `Xin lỗi, tôi gặp sự cố: ${errorMessage}. Vui lòng thử lại sau.`,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, errorBotMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  const handleReset = useCallback(() => {
    setMessages([]);
    toast.success("Đã làm mới", "Hội thoại đã được làm mới");
  }, []);

  return (
    <>
      <ChatbotBubble isOpen={isOpen} onToggle={handleToggle} unreadCount={0} />
      <ChatbotWindow
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        messages={messages}
        onSendMessage={handleSendMessage}
        onReset={handleReset}
        isLoading={isLoading}
      />
    </>
  );
}

export { ChatbotBubble } from "./chatbot-bubble";
export { ChatbotWindow } from "./chatbot-window";
export { ChatbotMessage } from "./chatbot-message";
export { ChatbotInput } from "./chatbot-input";
