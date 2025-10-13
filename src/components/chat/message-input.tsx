"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { MessageInputProps } from "@/types/chat";
import { Image as ImageIcon, Send } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

export function MessageInput({
  onSend,
  onTyping,
  disabled = false,
  placeholder = "Nhập tin nhắn...",
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle typing indicator with debounce
  const handleTypingChange = useCallback(
    (typing: boolean) => {
      if (!onTyping || isTyping === typing) return;

      setIsTyping(typing);
      onTyping(typing);

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Stop typing after 3 seconds of inactivity
      if (typing) {
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
          onTyping(false);
        }, 3000);
      }
    },
    [onTyping, isTyping]
  );

  // Handle message change
  const handleMessageChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newMessage = e.target.value;
      setMessage(newMessage);

      // Send typing indicator when user starts typing
      if (newMessage.trim() && !isTyping) {
        handleTypingChange(true);
      } else if (!newMessage.trim() && isTyping) {
        handleTypingChange(false);
      }
    },
    [isTyping, handleTypingChange]
  );

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || disabled || isUploading) return;

    // Stop typing indicator before sending
    if (isTyping) {
      handleTypingChange(false);
    }

    onSend(trimmedMessage);
    setMessage("");

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    // Simulate file upload
    setTimeout(() => {
      // In real app, upload file and get URL
      // const mockUrl = URL.createObjectURL(file);
      const isImage = file.type.startsWith("image/");

      if (isImage) {
        onSend(`Đã gửi hình ảnh: ${file.name}`, "image");
      } else {
        onSend(`Đã gửi tệp: ${file.name}`, "file");
      }

      setIsUploading(false);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }, 1000);
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 120; // Max height in pixels
      textareaRef.current.style.height = `${Math.min(
        scrollHeight,
        maxHeight
      )}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (isTyping && onTyping) {
        onTyping(false);
      }
    };
  }, [isTyping, onTyping]);

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <div className="flex items-end gap-3">
        {/* File upload button */}
        <div className="flex-shrink-0">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            accept="image/*,.pdf,.doc,.docx,.txt"
          />
        </div>
        {/* Image upload button */}
        <div className="flex-shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={disabled || isUploading}
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.accept = "image/*";
                fileInputRef.current.click();
              }
            }}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            <ImageIcon className="w-4 h-4" />
          </Button>
        </div>

        {/* Message input */}
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleMessageChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isUploading}
            className={cn(
              "resize-none rounded-lg",
              "min-h-[40px] max-h-[120px] py-2 px-3",
              "placeholder:text-gray-400",
              "focus:border-[#DCBB87] focus:ring-2 focus:ring-[#DCBB87]/20",
              "focus-visible:border-[#DCBB87] focus-visible:ring-2 focus-visible:ring-[#DCBB87]/20",
              "transition-all duration-200 ease-in-out"
            )}
            rows={1}
          />

          {/* Character count or status */}
          {isUploading && (
            <div className="absolute bottom-2 right-2 text-xs text-gray-500">
              Đang tải lên...
            </div>
          )}
        </div>

        {/* Send button */}
        <div className="flex-shrink-0">
          <Button
            type="button"
            onClick={handleSend}
            disabled={!message.trim() || disabled || isUploading}
            className={cn(
              "bg-[#DCBB87] hover:bg-[#DCBB87]/90 text-white",
              "transition-all duration-200",
              (!message.trim() || disabled || isUploading) &&
                "opacity-50 cursor-not-allowed"
            )}
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Upload progress indicator */}
      {isUploading && (
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div className="bg-[#DCBB87] h-1 rounded-full animate-pulse w-1/3"></div>
          </div>
        </div>
      )}
    </div>
  );
}
