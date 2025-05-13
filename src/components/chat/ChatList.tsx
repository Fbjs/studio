
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

interface ChatListProps {
  chats: ChatContact[];
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
  currentUser: User;
  onToggleBotConfigSheet: () => void;
}

export function ChatList({ chats, selectedChatId, onSelectChat, currentUser, onToggleBotConfigSheet }: ChatListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredAndCategorizedChats = useMemo(() => {
    let tempChats = [...chats]; // Create a new array to avoid mutating the original prop

    // Filter by category
    if (activeCategory === 'Unread') {
      tempChats = tempChats.filter(chat => chat.unreadCount && chat.unreadCount > 0);
    } else if (activeCategory !== 'All') {
      tempChats = tempChats.filter(chat => chat.category === activeCategory);
    }

    // Filter by search term
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
          <h2 className="text-xl font-semibold">Chats</h2>
          <Button onClick={onToggleBotConfigSheet} variant="ghost" size="icon" aria-label="Configure AI Bots">
            <Bot size={20} className="text-muted-foreground hover:text-accent" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search chats..." 
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
            <TabsTrigger value="All" className="text-xs px-2">All</TabsTrigger>
            <TabsTrigger value="Work" className="text-xs px-2">Work</TabsTrigger>
            <TabsTrigger value="Friends" className="text-xs px-2">Friends</TabsTrigger>
            <TabsTrigger value="Unread" className="text-xs px-2">Unread</TabsTrigger>
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
              {activeCategory === "All" && !searchTerm ? "No chats yet." : `No chats in ${activeCategory.toLowerCase()} ${searchTerm ? `matching "${searchTerm}"` : ""}.`}
            </p>
          )}
        </div>
      </ScrollArea>

      {/* User Profile Footer */}
      <div className="p-3 border-t border-border flex items-center bg-card">
        <UserAvatar src={currentUser.avatarUrl} alt={currentUser.name} size={36} data-ai-hint="user profile small" />
        <span className="ml-3 font-semibold text-sm truncate">{currentUser.name}</span>
      </div>
    </div>
  );
}
