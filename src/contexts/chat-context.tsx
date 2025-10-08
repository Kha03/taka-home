"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { Chat, Message, ChatContextType, User } from "@/types/chat";

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Mock data cho development
const mockUsers: User[] = [
  {
    id: "1",
    name: "Nguyễn Văn An",
    avatar: "/public/assets/imgs/avatar.png",
    role: "landlord",
    email: "an@example.com",
    phone: "0123456789",
  },
  {
    id: "2",
    name: "Trần Thị Bình",
    avatar: "/public/assets/imgs/avatar.png",
    role: "tenant",
    email: "binh@example.com",
    phone: "0987654321",
  },
  {
    id: "3",
    name: "Lê Minh Cường",
    avatar: "/public/assets/imgs/avatar.png",
    role: "landlord",
    email: "cuong@example.com",
    phone: "0555666777",
  },
];

const mockChats: Chat[] = [
  {
    id: "chat1",
    participants: [mockUsers[0], mockUsers[1]],
    lastMessage: {
      id: "msg1",
      chatId: "chat1",
      senderId: "2",
      content: "Chào anh, em muốn hỏi về căn hộ này ạ",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      type: "text",
      status: "read",
    },
    unreadCount: 0,
    propertyId: "prop1",
    propertyTitle: "Căn hộ 2PN tại Quận 1",
    propertyImage: "/public/assets/imgs/house-item.png",
    isActive: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: "chat2",
    participants: [mockUsers[0], mockUsers[2]],
    lastMessage: {
      id: "msg2",
      chatId: "chat2",
      senderId: "3",
      content: "Cảm ơn anh đã quan tâm đến bất động sản của em",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      type: "text",
      status: "delivered",
    },
    unreadCount: 2,
    propertyId: "prop2",
    propertyTitle: "Nhà phố 3 tầng tại Quận 7",
    propertyImage: "/public/assets/imgs/house-item.png",
    isActive: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
];

const mockMessages: { [key: string]: Message[] } = {
  chat1: [
    {
      id: "msg1-1",
      chatId: "chat1",
      senderId: "2",
      content: "Xin chào anh, em đang quan tâm đến căn hộ này",
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      type: "text",
      status: "read",
    },
    {
      id: "msg1-2",
      chatId: "chat1",
      senderId: "1",
      content: "Chào em, anh rất vui khi em quan tâm. Em có câu hỏi gì không?",
      timestamp: new Date(Date.now() - 55 * 60 * 1000),
      type: "text",
      status: "read",
    },
    {
      id: "msg1-3",
      chatId: "chat1",
      senderId: "2",
      content: "Em muốn hỏi về giá thuê và các tiện ích xung quanh ạ",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      type: "text",
      status: "read",
    },
  ],
  chat2: [
    {
      id: "msg2-1",
      chatId: "chat2",
      senderId: "3",
      content: "Anh ơi, em có thể xem nhà vào cuối tuần được không?",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      type: "text",
      status: "delivered",
    },
    {
      id: "msg2-2",
      chatId: "chat2",
      senderId: "3",
      content: "Cảm ơn anh đã quan tâm đến bất động sản của em",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      type: "text",
      status: "delivered",
    },
  ],
};

interface ChatProviderProps {
  children: React.ReactNode;
  currentUserId?: string;
}

export function ChatProvider({
  children,
  currentUserId = "1",
}: ChatProviderProps) {
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshChats = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setChats(mockChats);
      setError(null);
    } catch {
      setError("Không thể tải danh sách chat");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadMessages = useCallback(async (chatId: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));
      const chatMessages = mockMessages[chatId] || [];
      setMessages(chatMessages);
      setError(null);
    } catch {
      setError("Không thể tải tin nhắn");
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendMessage = useCallback(
    async (content: string, type: Message["type"] = "text") => {
      if (!activeChat) return;

      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        chatId: activeChat.id,
        senderId: currentUserId,
        content,
        timestamp: new Date(),
        type,
        status: "sent",
      };

      // Optimistically update UI
      setMessages((prev) => [...prev, newMessage]);

      // Update last message in chat
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChat.id
            ? { ...chat, lastMessage: newMessage, updatedAt: new Date() }
            : chat
        )
      );

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Update message status
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg
          )
        );
      } catch {
        setError("Không thể gửi tin nhắn");
        // Remove message on error
        setMessages((prev) => prev.filter((msg) => msg.id !== newMessage.id));
      }
    },
    [activeChat, currentUserId]
  );

  const markAsRead = useCallback(async (chatId: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 200));

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
        )
      );
    } catch {
      setError("Không thể cập nhật trạng thái đã đọc");
    }
  }, []);

  const createChat = useCallback(
    async (participantId: string, propertyId?: string): Promise<Chat> => {
      const participant = mockUsers.find((u) => u.id === participantId);
      if (!participant) throw new Error("Không tìm thấy người dùng");

      const newChat: Chat = {
        id: `chat-${Date.now()}`,
        participants: [
          mockUsers.find((u) => u.id === currentUserId)!,
          participant,
        ],
        unreadCount: 0,
        propertyId,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setChats((prev) => [newChat, ...prev]);
      return newChat;
    },
    [currentUserId]
  );

  const handleSetActiveChat = useCallback(
    (chat: Chat | null) => {
      setActiveChat(chat);
      if (chat) {
        loadMessages(chat.id);
        if (chat.unreadCount > 0) {
          markAsRead(chat.id);
        }
      } else {
        setMessages([]);
      }
    },
    [loadMessages, markAsRead]
  );

  const contextValue: ChatContextType = {
    chats,
    activeChat,
    messages,
    isLoading,
    error,
    setActiveChat: handleSetActiveChat,
    sendMessage,
    markAsRead,
    loadMessages,
    createChat,
    refreshChats,
  };

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
