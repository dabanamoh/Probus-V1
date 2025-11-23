export interface Employee {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  position: string;
  department: string;
  isOnline: boolean;
  lastSeen?: Date;
}

export interface ChatGroup {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  members: Employee[];
  admins: string[]; // Employee IDs who are admins
  createdBy: string;
  createdAt: Date;
  lastMessage?: ChatMessage;
  unreadCount: number;
  messages?: ChatMessage[]; // All messages in the group
}

export interface CallData {
  id: string;
  type: 'voice' | 'video';
  status: 'missed' | 'completed' | 'incoming' | 'outgoing';
  duration?: string;
  participants: { id: string; name: string; avatar?: string }[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'meeting_invite' | 'call';
  timestamp: Date;
  isRead: boolean;
  replyTo?: string; // Message ID being replied to
  meetingData?: MeetingData;
  callData?: CallData;
  fileName?: string; // For file messages
  topics?: string[]; // Tags/topics for better search
}

export interface MeetingData {
  id: string;
  title: string;
  type: 'video' | 'audio';
  scheduledTime: Date;
  duration: number; // in minutes
  isRecorded: boolean;
  meetingLink?: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
}

export interface DirectChat {
  id: string;
  participants: Employee[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  messages?: ChatMessage[]; // All messages in the chat
}

export type ChatType = 'direct' | 'group';

export interface ActiveChat {
  id: string;
  type: ChatType;
  data: DirectChat | ChatGroup;
  messages: ChatMessage[];
}