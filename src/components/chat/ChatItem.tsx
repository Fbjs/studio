
"use client";

import type { ChatContact } from '@/lib/types';
import { UserAvatar } from './UserAvatar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';

interface ChatItemProps {
  chat: ChatContact;
  isSelected: boolean;
  onSelect: () => void;
}

export function ChatItem({ chat, isSelected, onSelect }: ChatItemProps) {
  const { dateLocale, t } = useTranslation();

  return (
    <div
      onClick={onSelect}
      className={cn(
        'flex items-center p-3 hover:bg-muted/50 cursor-pointer rounded-lg transition-colors duration-150',
        isSelected ? 'bg-muted' : ''
      )}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
    >
      <UserAvatar src={chat.avatarUrl} alt={chat.name} size={48} />
      <div className="ml-3 flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-sm truncate">{chat.name}</h3>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {format(chat.lastMessageTimestamp, 'p', { locale: dateLocale })}
          </span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-muted-foreground truncate pr-2">
            {chat.lastMessage}
          </p>
          {chat.unreadCount && chat.unreadCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {chat.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
