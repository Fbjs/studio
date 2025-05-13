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

export interface BotFlowStep {
  id: string;
  name: string;
  description: string;
  prompt: string;
}

export type ChatCategory = BotFlowStep['name']; // Category is the name of a BotFlowStep

export interface ChatContact {
  id:string;
  name: string;
  avatarUrl: string;
  lastMessage: string;
  lastMessageTimestamp: Date;
  unreadCount?: number;
  onlineStatus?: 'online' | 'offline' | string; // e.g., "last seen 2 hours ago"
  category?: ChatCategory; 
}

export type PlanName = 'FREE' | 'STARTER' | 'BUSINESS' | 'ENTERPRISE';

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  planName: PlanName; // Made non-optional, defaulting to 'FREE'
  tokensUsed: number;   // Made non-optional
  tokensTotal: number;  // Made non-optional
}

export interface SalesExecutive {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  // Future: Add color for calendar identification, specialization, etc.
}

export interface AvailabilitySlot {
  id: string;
  executiveId: string;
  startTime: Date;
  endTime: Date;
  isBooked: boolean;
  bookedByContactId?: string; // ID of the ChatContact who booked
  appointmentNotes?: string;
}
