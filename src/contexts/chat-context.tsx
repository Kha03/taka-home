"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { Chat, Message, ChatContextType } from "@/types/chat";
import {
  chatService,
  type Chatroom,
  type ChatMessage,
} from "@/lib/api/services/chat";
import {
  chatSocket,
  type SocketMessage,
  type UserTypingInfo,
} from "@/lib/socket/chat-socket";

const ChatContext = createContext<ChatContextType | undefined>(undefined);

/**
 * Transform API Chatroom to local Chat type
 */
function transformChatroomToChat(
  chatroom: Chatroom,
  currentUserId: string
): Chat {
  const lastMessage = chatroom.messages[chatroom.messages.length - 1];

  return {
    id: chatroom.id,
    participants: [
      {
        id: chatroom.user1.id,
        name: chatroom.user1.fullName || "Unknown",
        avatar: chatroom.user1.avatarUrl || undefined,
        role: chatroom.user1.id === currentUserId ? "tenant" : "landlord",
        email: chatroom.user1.email,
        phone: chatroom.user1.phone,
      },
      {
        id: chatroom.user2.id,
        name: chatroom.user2.fullName || "Unknown",
        avatar: chatroom.user2.avatarUrl || undefined,
        role: chatroom.user2.id === currentUserId ? "tenant" : "landlord",
        email: chatroom.user2.email,
        phone: chatroom.user2.phone,
      },
    ],
    lastMessage: lastMessage
      ? {
          id: lastMessage.id,
          chatroomId:
            typeof lastMessage.chatroom === "string"
              ? lastMessage.chatroom
              : lastMessage.chatroom?.id || chatroom.id,
          sender: lastMessage.sender,
          content: lastMessage.content,
          timestamp: new Date(lastMessage.createdAt),
          type: "text",
          status: "delivered",
        }
      : undefined,
    unreadCount: 0,
    propertyId: chatroom.property.id,
    propertyTitle: chatroom.property.title,
    propertyImage: chatroom.property.heroImage || undefined,
    isActive: true,
    createdAt: new Date(chatroom.createdAt),
    updatedAt: new Date(chatroom.updatedAt),
  };
}

/**
 * Transform API ChatMessage to local Message type
 */
function transformChatMessage(chatMessage: ChatMessage): Message {
  return {
    id: chatMessage.id,
    chatroomId: chatMessage.chatroom?.id || "",
    sender: chatMessage.sender,
    content: chatMessage.content,
    timestamp: new Date(chatMessage.createdAt),
    type: "text",
    status: "delivered",
  };
}

/**
 * Transform Socket Message to local Message type
 */
function transformSocketMessage(socketMessage: SocketMessage): Message {
  return {
    id: socketMessage.id,
    chatroomId: socketMessage.chatroomId,
    sender: socketMessage.sender,
    content: socketMessage.content,
    timestamp: new Date(socketMessage.createdAt),
    type: "text",
    status: "delivered",
  };
}

interface ChatProviderProps {
  children: React.ReactNode;
  currentUserId?: string;
}

export function ChatProvider({
  children,
  currentUserId = "1",
}: ChatProviderProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<Map<string, UserTypingInfo>>(
    new Map()
  );

  /**
   * Setup message handlers (socket connection is handled by SocketProvider)
   */
  useEffect(() => {
    // Setup message handler
    const unsubscribeMessage = chatSocket.onMessage((socketMessage) => {
      const message = transformSocketMessage(socketMessage);

      // Add message to current chat if it's the active one
      if (activeChat?.id === message.chatroomId) {
        setMessages((prev) => [...prev, message]);
      }

      // Update last message in chat list
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === message.chatroomId
            ? {
                ...chat,
                lastMessage: message,
                updatedAt: new Date(),
                unreadCount:
                  activeChat?.id === message.chatroomId
                    ? 0
                    : chat.unreadCount + 1,
              }
            : chat
        )
      );
    });

    // Setup typing handler
    const unsubscribeTyping = chatSocket.onTyping((typingInfo) => {
      // Ignore empty typing info (clear signal)
      if (!typingInfo.userId) return;

      // Only process typing for active chat and not from current user
      if (!activeChat || typingInfo.userId === currentUserId) return;

      setTypingUsers((prev) => {
        const newMap = new Map(prev);

        if (typingInfo.isTyping) {
          newMap.set(typingInfo.userId, typingInfo);

          // Auto-clear typing after 5 seconds
          setTimeout(() => {
            setTypingUsers((current) => {
              const updated = new Map(current);
              const existing = updated.get(typingInfo.userId);
              // Only remove if it's the same timestamp (not updated)
              if (existing?.timestamp === typingInfo.timestamp) {
                updated.delete(typingInfo.userId);
              }
              return updated;
            });
          }, 5000);
        } else {
          newMap.delete(typingInfo.userId);
        }

        return newMap;
      });
    });

    // Setup error handler
    const unsubscribeError = chatSocket.onError(() => {
      setError("Lỗi kết nối real-time");
    });

    // Cleanup handlers only (not disconnect)
    return () => {
      unsubscribeMessage();
      unsubscribeTyping();
      unsubscribeError();
    };
  }, [activeChat, currentUserId]);

  /**
   * Load chats on mount
   */
  useEffect(() => {
    refreshChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Refresh chat list from API
   */
  const refreshChats = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await chatService.getMyChatrooms();
      if (response.code === 200 && response.data) {
        const transformedChats = response.data.map((chatroom) =>
          transformChatroomToChat(chatroom, currentUserId)
        );
        setChats(transformedChats);
        setError(null);
      } else {
        throw new Error(response.message || "Không thể tải danh sách chat");
      }
    } catch {
      setError("Không thể tải danh sách chat");
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId]);

  /**
   * Load messages for a specific chat
   */
  const loadMessages = useCallback(async (chatId: string) => {
    setIsLoading(true);
    try {
      const response = await chatService.getChatroomMessages(chatId);
      if (response.code === 200 && response.data) {
        const transformedMessages = response.data.map(transformChatMessage);
        setMessages(transformedMessages);
        setError(null);
      } else {
        throw new Error(response.message || "Không thể tải tin nhắn");
      }
    } catch {
      setError("Không thể tải tin nhắn");
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Send message via API and WebSocket
   */
  const sendMessage = useCallback(
    async (content: string, type: Message["type"] = "text") => {
      if (!activeChat) return;

      try {
        // 1. Send via HTTP API first (to ensure message is saved in DB)
        const response = await chatService.sendMessage(
          activeChat.id,
          currentUserId,
          content
        );

        if (response.code === 201 && response.data) {
          // 2. Also send via WebSocket for real-time delivery to other users
          // WebSocket will broadcast to other participants
          try {
            chatSocket.sendMessage({
              chatroomId: activeChat.id,
              content,
            });
          } catch {
            // Don't fail if WebSocket fails - message is already saved via API
            console.warn("WebSocket send failed, but message saved via API");
          }
        } else {
          throw new Error(response.message || "Không thể gửi tin nhắn");
        }
      } catch {
        setError("Không thể gửi tin nhắn");
      }
    },
    [activeChat, currentUserId, messages]
  );

  /**
   * Mark chat as read
   */
  const markAsRead = useCallback(async (chatId: string) => {
    try {
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
        )
      );
    } catch {
      setError("Không thể cập nhật trạng thái đã đọc");
    }
  }, []);

  /**
   * Create new chat for a property
   */
  const createChat = useCallback(
    async (participantId: string, propertyId?: string): Promise<Chat> => {
      try {
        if (!propertyId) {
          throw new Error("PropertyId is required");
        }

        const response = await chatService.startChatForProperty(propertyId);
        if (
          response.code === 200 &&
          response.data &&
          response.data.length > 0
        ) {
          const newChatroom = response.data[0];
          const newChat = transformChatroomToChat(newChatroom, currentUserId);

          // Add to chat list if not already exists
          setChats((prev) => {
            const exists = prev.some((chat) => chat.id === newChat.id);
            return exists ? prev : [newChat, ...prev];
          });

          return newChat;
        } else {
          throw new Error(response.message || "Không thể tạo chat");
        }
      } catch (err) {
        setError("Không thể tạo chat");
        throw err;
      }
    },
    [currentUserId]
  );

  /**
   * Send typing indicator
   */
  const sendTypingIndicator = useCallback(
    (isTyping: boolean) => {
      if (!activeChat || !chatSocket.isConnected()) {
        return;
      }
      chatSocket.sendTyping(activeChat.id, isTyping);
    },
    [activeChat]
  );

  /**
   * Get typing users for active chat
   */
  const getTypingUsers = useCallback(() => {
    return Array.from(typingUsers.values()).filter((info) => info.isTyping);
  }, [typingUsers]);

  /**
   * Handle active chat selection
   */
  const handleSetActiveChat = useCallback(
    (chat: Chat | null) => {
      // Leave previous room
      if (activeChat && chatSocket.isConnected()) {
        chatSocket.leaveRoom(activeChat.id);
      }

      // Clear typing users when switching chats
      setTypingUsers(new Map());

      setActiveChat(chat);
      if (chat) {
        // Join new room
        if (chatSocket.isConnected()) {
          chatSocket.joinRoom(chat.id);
        }

        loadMessages(chat.id);
        if (chat.unreadCount > 0) {
          markAsRead(chat.id);
        }
      } else {
        setMessages([]);
      }
    },
    [loadMessages, markAsRead, activeChat]
  );

  const contextValue: ChatContextType = {
    chats,
    activeChat,
    messages,
    isLoading,
    error,
    typingUsers: getTypingUsers(),
    setActiveChat: handleSetActiveChat,
    sendMessage,
    markAsRead,
    loadMessages,
    createChat,
    refreshChats,
    sendTypingIndicator,
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
