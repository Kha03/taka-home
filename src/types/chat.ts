export interface User {
  id: string;
  name: string;
  avatar?: string;
  role: "tenant" | "landlord"; // người thuê hoặc người cho thuê
  email?: string;
  phone?: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: "text" | "image" | "file";
  status: "sent" | "delivered" | "read";
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: "image" | "document" | "other";
  size: number;
}

export interface Chat {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  propertyId?: string; // ID bất động sản liên quan
  propertyTitle?: string;
  propertyImage?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatContextType {
  chats: Chat[];
  activeChat: Chat | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setActiveChat: (chat: Chat | null) => void;
  sendMessage: (content: string, type?: Message["type"]) => Promise<void>;
  markAsRead: (chatId: string) => Promise<void>;
  loadMessages: (chatId: string) => Promise<void>;
  createChat: (participantId: string, propertyId?: string) => Promise<Chat>;
  refreshChats: () => Promise<void>;
}

export interface ChatListItemProps {
  chat: Chat;
  isActive: boolean;
  onClick: () => void;
  currentUserId: string;
}

export interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar?: boolean;
  user?: User;
}

export interface MessageInputProps {
  onSend: (content: string, type?: Message["type"]) => void;
  disabled?: boolean;
  placeholder?: string;
}
