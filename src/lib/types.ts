export type MessageStatus = 'sent' | 'delivered' | 'read' | 'pending';

export interface Message {
  id: string;
  senderId: string; // 'currentUser' or other user's ID
  content: string;
  timestamp: Date;
  status: MessageStatus;
  avatarUrl?: string; // Only for received messages typically
  senderName?: string; // Only for group chats or if needed
}

export interface ChatContact {
  id: string;
  name: string;
  avatarUrl: string;
  lastMessage: string;
  lastMessageTimestamp: Date;
  unreadCount?: number;
  onlineStatus?: 'online' | 'offline' | string; // e.g., "last seen 2 hours ago"
  category?: 'Work' | 'Friends' | 'Personal' | string; // Added for chat categorization
}

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  planName?: string;
  tokensUsed?: number;
  tokensTotal?: number;
}
