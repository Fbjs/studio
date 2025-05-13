
"use client";

import { useState, useMemo, useEffect } from 'react';
import { ChatList } from '@/components/chat/ChatList';
import { ChatWindow } from '@/components/chat/ChatWindow';
import type { ChatContact, Message, User } from '@/lib/types';
import { MessageSquareText } from 'lucide-react';
import { BotConfigSheet } from '@/components/ai/BotConfigSheet'; // Import BotConfigSheet

// Mock Data
const currentUser: User = {
  id: 'currentUser',
  name: 'You',
  avatarUrl: 'https://picsum.photos/seed/currentuser/100/100',
};

const mockContacts: ChatContact[] = [
  {
    id: 'contact1',
    name: 'Alice Wonderland',
    avatarUrl: 'https://picsum.photos/seed/alice/100/100',
    lastMessage: "Hey, how's it going?",
    lastMessageTimestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    unreadCount: 2,
    onlineStatus: 'online',
    category: 'Work',
  },
  {
    id: 'contact2',
    name: 'Bob The Builder',
    avatarUrl: 'https://picsum.photos/seed/bob/100/100',
    lastMessage: 'Can we fix it? Yes, we can!',
    lastMessageTimestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    onlineStatus: 'Last seen 15m ago',
    category: 'Friends',
  },
  {
    id: 'contact3',
    name: 'Charlie Brown',
    avatarUrl: 'https://picsum.photos/seed/charlie/100/100',
    lastMessage: 'Good grief!',
    lastMessageTimestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    unreadCount: 5,
    category: 'Work',
  },
  {
    id: 'contact4',
    name: 'Diana Prince',
    avatarUrl: 'https://picsum.photos/seed/diana/100/100',
    lastMessage: 'Wondering about the project deadline.',
    lastMessageTimestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    onlineStatus: 'offline',
    category: 'Friends',
  },
];

const mockMessagesStore: { [chatId: string]: Message[] } = {
  contact1: [
    { id: 'msg1-1', senderId: 'contact1', content: 'Hello!', timestamp: new Date(Date.now() - 10 * 60 * 1000), status: 'read', avatarUrl: mockContacts[0].avatarUrl, senderName: mockContacts[0].name },
    { id: 'msg1-2', senderId: 'currentUser', content: "Hey, how's it going?", timestamp: new Date(Date.now() - 5 * 60 * 1000), status: 'delivered' },
  ],
  contact2: [
    { id: 'msg2-1', senderId: 'contact2', content: 'Can we fix it? Yes, we can!', timestamp: new Date(Date.now() - 30 * 60 * 1000), status: 'read', avatarUrl: mockContacts[1].avatarUrl, senderName: mockContacts[1].name },
  ],
  contact3: [
    { id: 'msg3-1', senderId: 'contact3', content: 'Are you free for a call?', timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000), status: 'read', avatarUrl: mockContacts[2].avatarUrl, senderName: mockContacts[2].name },
    { id: 'msg3-2', senderId: 'currentUser', content: 'Not right now, maybe later?', timestamp: new Date(Date.now() - 2.2 * 60 * 60 * 1000), status: 'sent' },
    { id: 'msg3-3', senderId: 'contact3', content: 'Good grief!', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), status: 'read', avatarUrl: mockContacts[2].avatarUrl, senderName: mockContacts[2].name },
  ],
   contact4: [
    { id: 'msg4-1', senderId: 'contact4', content: 'Wondering about the project deadline.', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), status: 'read', avatarUrl: mockContacts[3].avatarUrl, senderName: mockContacts[3].name },
  ],
};


export default function Home() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<ChatContact[]>(mockContacts);
  const [messagesStore, setMessagesStore] = useState<{ [chatId: string]: Message[] }>(mockMessagesStore);
  const [isBotConfigSheetOpen, setIsBotConfigSheetOpen] = useState(false);

  const selectedChat = useMemo(() => {
    return chats.find(chat => chat.id === selectedChatId) || null;
  }, [selectedChatId, chats]);

  const messagesForSelectedChat = useMemo(() => {
    if (!selectedChatId || !messagesStore[selectedChatId]) return [];
    return messagesStore[selectedChatId];
  }, [selectedChatId, messagesStore]);

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
    setChats(prevChats => 
      prevChats.map(c => 
        c.id === chatId ? { ...c, unreadCount: 0 } : c
      )
    );
  };

  const handleSendMessage = (content: string) => {
    if (!selectedChatId) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      senderId: currentUser.id,
      content,
      timestamp: new Date(),
      status: 'sent',
    };

    setMessagesStore(prevStore => ({
      ...prevStore,
      [selectedChatId]: [...(prevStore[selectedChatId] || []), newMessage],
    }));

    setChats(prevChats => 
      prevChats.map(c => 
        c.id === selectedChatId 
        ? { ...c, lastMessage: content, lastMessageTimestamp: new Date() } 
        : c
      ).sort((a, b) => b.lastMessageTimestamp.getTime() - a.lastMessageTimestamp.getTime())
    );

    setTimeout(() => {
      const contact = chats.find(c => c.id === selectedChatId);
      if (contact) {
        const replyMessage: Message = {
          id: `reply-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          senderId: contact.id,
          content: `Okay, I got: "${content.substring(0, 20)}..."`,
          timestamp: new Date(),
          status: 'read',
          avatarUrl: contact.avatarUrl,
          senderName: contact.name,
        };
        setMessagesStore(prevStore => ({
          ...prevStore,
          [selectedChatId]: [...(prevStore[selectedChatId] || []), replyMessage],
        }));
        setChats(prevChats => 
          prevChats.map(c => 
            c.id === selectedChatId 
            ? { ...c, lastMessage: replyMessage.content, lastMessageTimestamp: new Date(), unreadCount: (c.unreadCount || 0) + (selectedChatId !== c.id ? 1 : 0) } 
            : c
          ).sort((a, b) => b.lastMessageTimestamp.getTime() - a.lastMessageTimestamp.getTime())
        );
      }
    }, 1500);
  };
  
  useEffect(() => {
    const updatedChatsWithHints = mockContacts.map(contact => ({
      ...contact,
      avatarUrl: `${contact.avatarUrl}?${new URLSearchParams({"data-ai-hint": "person profile"}).toString()}`
    }));
     const updatedCurrentUser = {
      ...currentUser,
      avatarUrl: `${currentUser.avatarUrl}?${new URLSearchParams({"data-ai-hint": "user profile"}).toString()}`
    };
    
    const updatedMessagesStoreWithHints = { ...mockMessagesStore };
    for (const chatId in updatedMessagesStoreWithHints) {
        updatedMessagesStoreWithHints[chatId] = updatedMessagesStoreWithHints[chatId].map(msg => {
            if (msg.avatarUrl) {
                 // Ensure base URL doesn't already have params
                const baseUrl = msg.avatarUrl.split('?')[0];
                return { ...msg, avatarUrl: `${baseUrl}?${new URLSearchParams({"data-ai-hint": "chat avatar"}).toString()}` };
            }
            return msg;
        });
    }
    // This is a bit tricky because currentUser is not in state, but we need to update its URL for UserAvatar
    // For this demo, we'll update the global const. In a real app, currentUser would be in state or context.
    currentUser.avatarUrl = updatedCurrentUser.avatarUrl;


    setChats(updatedChatsWithHints);
    setMessagesStore(updatedMessagesStoreWithHints);
  }, []);


  const toggleBotConfigSheet = () => {
    setIsBotConfigSheetOpen(prev => !prev);
  };

  return (
    <div className="flex h-screen antialiased text-foreground bg-background overflow-hidden">
      <ChatList 
        chats={chats} 
        selectedChatId={selectedChatId} 
        onSelectChat={handleSelectChat}
        currentUser={currentUser}
        onToggleBotConfigSheet={toggleBotConfigSheet}
      />
      <main className="flex-1 flex flex-col">
        {selectedChat ? (
          <ChatWindow
            chat={selectedChat}
            messages={messagesForSelectedChat}
            currentUser={currentUser}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
            <MessageSquareText size={64} className="mb-4 opacity-50" />
            <h2 className="text-2xl font-semibold mb-2">DarkWhisper Chat</h2>
            <p className="text-lg">Select a chat to start messaging.</p>
            <p className="mt-4 text-sm">Your messages are end-to-end encrypted (not really, this is a demo!).</p>
          </div>
        )}
      </main>
      <BotConfigSheet 
        isOpen={isBotConfigSheetOpen} 
        onOpenChange={setIsBotConfigSheetOpen} 
      />
    </div>
  );
}
