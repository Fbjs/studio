
"use client";

import type { ChatContact, User } from '@/lib/types';
import { ChatItem } from './ChatItem';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Bot } from 'lucide-react';
import { useState, useMemo } from 'react';
import { UserAvatar } from './UserAvatar';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';


interface ChatListProps {
  chats: ChatContact[];
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
  currentUser: User;
  onToggleBotConfigSheet: () => void;
  onToggleUserProfileSheet: () => void; 
}

export function ChatList({ 
  chats, 
  selectedChatId, 
  onSelectChat, 
  currentUser, 
  onToggleBotConfigSheet,
  onToggleUserProfileSheet 
}: ChatListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const { t } = useTranslation();

  const filteredAndCategorizedChats = useMemo(() => {
    let tempChats = [...chats]; 

    if (activeCategory === 'Unread') {
      tempChats = tempChats.filter(chat => chat.unreadCount && chat.unreadCount > 0);
    } else if (activeCategory !== 'All') {
      // Assuming category might be translated, compare against original or translated values
      // For simplicity, this example assumes category values ('Work', 'Friends') are not translated themselves for filtering
      tempChats = tempChats.filter(chat => chat.category === activeCategory);
    }

    if (!searchTerm) return tempChats;
    return tempChats.filter(chat =>
      chat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [chats, searchTerm, activeCategory]);

  return (
    <div className="w-full md:w-96 bg-card flex flex-col border-r border-border h-full">
      {/* Header Section */}
      <div className="p-4 border-b border-border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{t('chat.title')}</h2>
          <Button onClick={onToggleBotConfigSheet} variant="ghost" size="icon" aria-label={t('chat.configureAIButtonLabel')}>
            <Bot size={20} className="text-muted-foreground hover:text-accent" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder={t('chat.searchPlaceholder')}
            className="pl-10 bg-background focus:bg-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs Section */}
      <div className="px-4 py-2 border-b border-border">
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-9">
            <TabsTrigger value="All" className="text-xs px-2">{t('chat.all')}</TabsTrigger>
            <TabsTrigger value="Work" className="text-xs px-2">{t('chat.work')}</TabsTrigger>
            <TabsTrigger value="Friends" className="text-xs px-2">{t('chat.friends')}</TabsTrigger>
            <TabsTrigger value="Unread" className="text-xs px-2">{t('chat.unread')}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Chat Items Scroll Area */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {filteredAndCategorizedChats.length > 0 ? (
            filteredAndCategorizedChats.map((chat) => (
              <ChatItem
                key={chat.id}
                chat={chat}
                isSelected={chat.id === selectedChatId}
                onSelect={() => onSelectChat(chat.id)}
              />
            ))
          ) : (
            <p className="p-4 text-center text-muted-foreground">
              {activeCategory === "All" && !searchTerm 
                ? t('chat.noChatsYet') 
                : t('chat.noChatsMatching', { category: t(`chat.${activeCategory.toLowerCase()}` as any), searchTerm: searchTerm })
              }
            </p>
          )}
        </div>
      </ScrollArea>

      {/* User Profile Footer */}
      <div 
        className="p-3 border-t border-border flex items-center bg-card hover:bg-muted/50 cursor-pointer transition-colors duration-150"
        onClick={onToggleUserProfileSheet} 
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onToggleUserProfileSheet()}
        aria-label={t('chat.openUserProfileAria')}
      >
        <UserAvatar src={currentUser.avatarUrl} alt={t('chat.userProfileAlt', { name: currentUser.name })} size={36} data-ai-hint="user profile small" />
        <span className="ml-3 font-semibold text-sm truncate">{currentUser.name}</span>
      </div>
    </div>
  );
}
