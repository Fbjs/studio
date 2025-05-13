"use client";

import { useState, useMemo, useEffect } from 'react';
import { ChatList } from '@/components/chat/ChatList';
import { ChatWindow } from '@/components/chat/ChatWindow';
import type { ChatContact, Message, User } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area'; // Import ScrollArea if needed for main layout, though less likely here
import { MessageSquareText } from 'lucide-react';

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
  },
  {
    id: 'contact2',
    name: 'Bob The Builder',
    avatarUrl: 'https://picsum.photos/seed/bob/100/100',
    lastMessage: 'Can we fix it? Yes, we can!',
    lastMessageTimestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    onlineStatus: 'Last seen 15m ago',
  },
  {
    id: 'contact3',
    name: 'Charlie Brown',
    avatarUrl: 'https://picsum.photos/seed/charlie/100/100',
    lastMessage: 'Good grief!',
    lastMessageTimestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    unreadCount: 5,
  },
  {
    id: 'contact4',
    name: 'Diana Prince',
    avatarUrl: 'https://picsum.photos/seed/diana/100/100',
    lastMessage: 'Wondering about the project deadline.',
    lastMessageTimestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    onlineStatus: 'offline',
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

  const selectedChat = useMemo(() => {
    return chats.find(chat => chat.id === selectedChatId) || null;
  }, [selectedChatId, chats]);

  const messagesForSelectedChat = useMemo(() => {
    if (!selectedChatId || !messagesStore[selectedChatId]) return [];
    return messagesStore[selectedChatId];
  }, [selectedChatId, messagesStore]);

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
    // Mark messages as read (conceptually)
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
      status: 'sent', // Initially sent, could be updated to delivered/read later
    };

    setMessagesStore(prevStore => ({
      ...prevStore,
      [selectedChatId]: [...(prevStore[selectedChatId] || []), newMessage],
    }));

    // Update last message in chat list
    setChats(prevChats => 
      prevChats.map(c => 
        c.id === selectedChatId 
        ? { ...c, lastMessage: content, lastMessageTimestamp: new Date() } 
        : c
      ).sort((a, b) => b.lastMessageTimestamp.getTime() - a.lastMessageTimestamp.getTime()) // Re-sort chats by last message time
    );

    // Simulate receiving a reply after a short delay for demo purposes
    setTimeout(() => {
      const contact = chats.find(c => c.id === selectedChatId);
      if (contact) {
        const replyMessage: Message = {
          id: `reply-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          senderId: contact.id,
          content: `Okay, I got: "${content.substring(0, 20)}..."`,
          timestamp: new Date(),
          status: 'read', // Assume auto-read by current user
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
  
  // Add data-ai-hint to images in mock data for generation purposes
  useEffect(() => {
    const updatedChats = mockContacts.map(contact => ({
      ...contact,
      avatarUrl: `${contact.avatarUrl}?${new URLSearchParams({"data-ai-hint": "person profile"}).toString()}`
    }));
    currentUser.avatarUrl = `${currentUser.avatarUrl}?${new URLSearchParams({"data-ai-hint": "user profile"}).toString()}`;
    
    const updatedMessagesStore = { ...mockMessagesStore };
    for (const chatId in updatedMessagesStore) {
        updatedMessagesStore[chatId] = updatedMessagesStore[chatId].map(msg => {
            if (msg.avatarUrl) {
                return { ...msg, avatarUrl: `${msg.avatarUrl}?${new URLSearchParams({"data-ai-hint": "chat avatar"}).toString()}` };
            }
            return msg;
        });
    }

    setChats(updatedChats);
    // No need to update messagesStore directly with state setter if mockMessagesStore is updated, 
    // but if it's separate state, then do it:
    // setMessagesStore(updatedMessagesStore); // This might cause issues if state is already set
  }, []);


  return (
    <div className="flex h-screen antialiased text-foreground bg-background overflow-hidden">
      <ChatList chats={chats} selectedChatId={selectedChatId} onSelectChat={handleSelectChat} />
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
    </div>
  );
}
