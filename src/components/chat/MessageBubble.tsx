"use client";

import type { Message, User } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Check, CheckCheck } from 'lucide-react';
import { UserAvatar } from './UserAvatar';

interface MessageBubbleProps {
  message: Message;
  currentUser: User;
}

export function MessageBubble({ message, currentUser }: MessageBubbleProps) {
  const isCurrentUser = message.senderId === currentUser.id;

  const DeliveryIcon = () => {
    if (!isCurrentUser) return null;
    switch (message.status) {
      case 'sent':
        return <Check size={16} className="text-muted-foreground" />;
      case 'delivered':
        return <CheckCheck size={16} className="text-muted-foreground" />;
      case 'read':
        return <CheckCheck size={16} className="text-accent" />; // Teal for read
      case 'pending':
        return <Check size={16} className="text-muted-foreground/50 animate-pulse" />; // Example for pending
      default:
        return null;
    }
  };

  return (
    <div className={cn('flex mb-3', isCurrentUser ? 'justify-end' : 'justify-start')}>
      <div className={cn('flex items-end max-w-[70%]', isCurrentUser ? 'flex-row-reverse' : 'flex-row')}>
        {!isCurrentUser && (
          <UserAvatar src={message.avatarUrl} alt={message.senderName || 'Sender'} size={32} className="mr-2 mb-1 self-end" />
        )}
        <div
          className={cn(
            'p-3 rounded-lg shadow-md min-w-[80px]',
            isCurrentUser ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-card text-card-foreground rounded-bl-none'
          )}
        >
          {/* {!isCurrentUser && message.senderName && (
            <p className="text-xs font-semibold mb-1 text-accent">{message.senderName}</p> // Optional sender name for group chats
          )} */}
          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
          <div className="flex items-center justify-end mt-1.5 text-xs opacity-70">
            <span className="mr-1">{format(message.timestamp, 'p')}</span>
            {isCurrentUser && <DeliveryIcon />}
          </div>
        </div>
      </div>
    </div>
  );
}
