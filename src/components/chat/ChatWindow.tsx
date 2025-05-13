
"use client";

import type { ChatContact, Message, User } from '@/lib/types';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserAvatar } from './UserAvatar';
import { MoreVertical, Phone, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useRef } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface ChatWindowProps {
  chat: ChatContact;
  messages: Message[];
  currentUser: User;
  onSendMessage: (content: string) => void;
}

export function ChatWindow({ chat, messages, currentUser, onSendMessage }: ChatWindowProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [messages]);
  
  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      {/* Header */}
      <header className="p-3 border-b border-border flex items-center justify-between shadow-sm bg-card">
        <div className="flex items-center">
          <UserAvatar src={chat.avatarUrl} alt={chat.name} size={40} />
          <div className="ml-3">
            <h2 className="font-semibold text-base">{chat.name}</h2>
            <p className="text-xs text-muted-foreground">
              {chat.onlineStatus === 'online' ? t('chat.online') : chat.onlineStatus || t('chat.offline')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent">
            <Video size={20} />
            <span className="sr-only">{t('chat.videoCall')}</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent">
            <Phone size={20} />
            <span className="sr-only">{t('chat.audioCall')}</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent">
            <MoreVertical size={20} />
            <span className="sr-only">{t('chat.moreOptions')}</span>
          </Button>
        </div>
      </header>

      {/* Messages Area */}
      <ScrollArea className="flex-1" ref={scrollAreaRef} viewportRef={viewportRef}>
        <div className="p-4 space-y-2">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} currentUser={currentUser} />
          ))}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <MessageInput onSendMessage={onSendMessage} />
    </div>
  );
}
