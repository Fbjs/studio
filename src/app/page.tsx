
"use client";

import { useState, useMemo, useEffect as useEffectReact } from 'react';
import { useRouter } from 'next/navigation';
import { ChatList } from '@/components/chat/ChatList';
import { ChatWindow } from '@/components/chat/ChatWindow';
import type { ChatContact, Message, User, PlanName, BotFlowStep } from '@/lib/types';
import { MessageSquareText, Loader2 } from 'lucide-react';
import { BotConfigSheet } from '@/components/ai/BotConfigSheet';
import { UserProfileSheet } from '@/components/profile/UserProfileSheet';
import { useTranslation } from '@/hooks/useTranslation';

// Initial Mock Data for currentUser
const initialCurrentUser: User = {
  id: 'currentUser',
  name: 'Demo User',
  avatarUrl: 'https://picsum.photos/seed/currentuser/100/100',
  planName: 'FREE',
  tokensUsed: 0,
  tokensTotal: 10,
};

// Canonical names and structure for initial flow steps/categories
const initialBotFlowStepsData: Omit<BotFlowStep, 'id'>[] = [
  {
    name: "New",
    description: "Incoming chats that haven't been processed yet.",
    prompt: "This is a new conversation. Assess the initial message and prepare to engage according to the overall bot persona."
  },
  {
    name: "Greeting",
    description: "Initial response, e.g., \"Hi there, thanks for contacting us. I'm the FIA Assistant.\"",
    prompt: "You are in the Greeting phase. Your primary goal is to provide a warm welcome and introduce yourself as the FIA Assistant. Briefly state your purpose (e.g., to help with inquiries and schedule appointments). Do not ask for data yet."
  },
  {
    name: "Data Capture",
    description: "Collect important contact information (name, phone, email).",
    prompt: "You are in the Data Capture phase. Your goal is to politely request essential contact information. Ask for full name, email address, and phone number. Explain briefly why this information is helpful (e.g., 'to personalize your experience and for follow-up')."
  },
  {
    name: "Qualify",
    description: "Determine if they are a good lead (understand their needs, budget, etc.). Asks about desired date/time for potential scheduling.",
    prompt: "You are in the Qualify phase. Your goal is to understand the user's needs and interest. Ask open-ended questions about what they are looking for (e.g., 'What specific services are you interested in?', 'What challenges are you hoping to solve?'). If relevant to scheduling, you can also ask about their general availability preferences (e.g., 'Do you have any preferred days or times for a potential consultation?')."
  },
  {
    name: "Scheduled",
    description: "Handles the process of checking availability and proposing appointment times if the user is qualified and interested.",
    prompt: "You are in the Scheduled phase. The user has expressed interest in an appointment. Based on their preferences and the sales executive's availability (which you can query via a tool if needed), propose specific time slots. If a slot is chosen, confirm the details and create a draft appointment."
  },
  {
    name: "Closed",
    description: "Conversations where an appointment is confirmed or a deal is finalized.",
    prompt: "You are in the Closed phase. An appointment has been successfully scheduled or a deal has been finalized. Confirm all details of the appointment (date, time, executive, any preparation notes) or the deal. Thank the user and let them know what to expect next."
  },
  {
    name: "Follow-up",
    description: "Conversations where follow-up action is needed, e.g., user promised to provide more info later, or a scheduled appointment needs a reminder.",
    prompt: "You are in the Follow-up phase. This conversation requires a follow-up. This could be due to a pending query, a scheduled appointment reminder, or an incomplete interaction. Identify the reason for follow-up and take appropriate action (e.g., send a reminder, ask for missing information, or re-engage after a certain period)."
  }
];

const generateInitialBotFlowSteps = (): BotFlowStep[] => {
  return initialBotFlowStepsData.map((step, index) => ({
    ...step,
    id: `${step.name.toLowerCase().replace(/\s+/g, '-')}-${index}` // simple unique ID
  }));
};


const mockContacts: ChatContact[] = [
  {
    id: 'contact1',
    name: 'Alice Wonderland',
    avatarUrl: 'https://picsum.photos/seed/alice/100/100',
    lastMessage: "Hey, how's it going?",
    lastMessageTimestamp: new Date(Date.now() - 5 * 60 * 1000), 
    unreadCount: 2,
    onlineStatus: 'online',
    category: initialBotFlowStepsData[0].name, // New
  },
  {
    id: 'contact2',
    name: 'Bob The Builder',
    avatarUrl: 'https://picsum.photos/seed/bob/100/100',
    lastMessage: 'Can we fix it? Yes, we can!',
    lastMessageTimestamp: new Date(Date.now() - 30 * 60 * 1000), 
    onlineStatus: 'Last seen 15m ago',
    category: initialBotFlowStepsData[1].name, // Greeting
  },
  {
    id: 'contact3',
    name: 'Charlie Brown',
    avatarUrl: 'https://picsum.photos/seed/charlie/100/100',
    lastMessage: 'Good grief!',
    lastMessageTimestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), 
    unreadCount: 5,
    category: initialBotFlowStepsData[2].name, // Data Capture
  },
  {
    id: 'contact4',
    name: 'Diana Prince',
    avatarUrl: 'https://picsum.photos/seed/diana/100/100',
    lastMessage: 'Wondering about the project deadline.',
    lastMessageTimestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), 
    onlineStatus: 'offline',
    category: initialBotFlowStepsData[3].name, // Qualify
  },
  {
    id: 'contact5',
    name: 'Elon Musketeer',
    avatarUrl: 'https://picsum.photos/seed/elon/100/100',
    lastMessage: 'To the moon!',
    lastMessageTimestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    onlineStatus: 'offline',
    category: initialBotFlowStepsData[4].name, // Scheduled
  },
  {
    id: 'contact6',
    name: 'Fiona Gallagher',
    avatarUrl: 'https://picsum.photos/seed/fiona/100/100',
    lastMessage: 'Closing the deal tomorrow.',
    lastMessageTimestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    onlineStatus: 'online',
    category: initialBotFlowStepsData[5].name, // Closed
  },
   {
    id: 'contact7',
    name: 'Gus Fring',
    avatarUrl: 'https://picsum.photos/seed/gus/100/100',
    lastMessage: 'Need to follow up on this.',
    lastMessageTimestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    onlineStatus: 'offline',
    category: initialBotFlowStepsData[6].name, // Follow-up
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
  contact5: [
    { id: 'msg5-1', senderId: 'contact5', content: 'To the moon!', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), status: 'read', avatarUrl: mockContacts[4].avatarUrl, senderName: mockContacts[4].name },
  ],
  contact6: [
    { id: 'msg6-1', senderId: 'contact6', content: 'Closing the deal tomorrow.', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), status: 'read', avatarUrl: mockContacts[5].avatarUrl, senderName: mockContacts[5].name },
  ],
  contact7: [
    { id: 'msg7-1', senderId: 'contact7', content: 'Need to follow up on this.', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), status: 'read', avatarUrl: mockContacts[6].avatarUrl, senderName: mockContacts[6].name },
  ],
};


export default function Home() {
  const router = useRouter();
  const { t } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [currentUser, setCurrentUser] = useState<User>(initialCurrentUser);

  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<ChatContact[]>(mockContacts);
  const [messagesStore, setMessagesStore] = useState<{ [chatId: string]: Message[] }>(mockMessagesStore);
  const [isBotConfigSheetOpen, setIsBotConfigSheetOpen] = useState(false);
  const [isUserProfileSheetOpen, setIsUserProfileSheetOpen] = useState(false);
  const [botConversationFlowSteps, setBotConversationFlowSteps] = useState<BotFlowStep[]>(generateInitialBotFlowSteps());


  useEffectReact(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);

      const storedPlan = localStorage.getItem('currentUserPlan') as PlanName | null;
      const storedTokensTotal = localStorage.getItem('currentUserTokensTotal');
      const storedTokensUsed = localStorage.getItem('currentUserTokensUsed');

      setCurrentUser(prevUser => {
        let updatedUser = { ...prevUser };
        if (storedPlan) {
          updatedUser.planName = storedPlan;
          updatedUser.tokensUsed = 0; 
          switch (storedPlan) {
            case 'FREE': updatedUser.tokensTotal = 10; break;
            case 'STARTER': updatedUser.tokensTotal = 5000; break;
            case 'BUSINESS': updatedUser.tokensTotal = 20000; break;
            default: updatedUser.tokensTotal = 10; // Default for FREE or unknown
          }
        } else { // If no plan stored, default to FREE
            updatedUser.planName = 'FREE';
            updatedUser.tokensTotal = 10;
            updatedUser.tokensUsed = 0;
        }

        // Ensure tokens are numbers
        updatedUser.tokensTotal = storedTokensTotal ? parseInt(storedTokensTotal, 10) : updatedUser.tokensTotal;
        updatedUser.tokensUsed = storedTokensUsed ? parseInt(storedTokensUsed, 10) : updatedUser.tokensUsed;
        
        if (updatedUser.avatarUrl && !updatedUser.avatarUrl.includes('data-ai-hint')) {
           updatedUser.avatarUrl = `${updatedUser.avatarUrl.split('?')[0]}?${new URLSearchParams({"data-ai-hint": "user profile"}).toString()}`;
        }
        return updatedUser;
      });

    } else {
      localStorage.removeItem('isAuthenticated'); 
      router.replace('/login');
    }
  }, [router]);


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

    setCurrentUser(prev => ({
      ...prev,
      tokensUsed: (prev.tokensUsed || 0) + 1 
    }));

    setTimeout(() => {
      const contact = chats.find(c => c.id === selectedChatId);
      if (contact) {
        const replyMessage: Message = {
          id: `reply-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          senderId: contact.id,
          content: `Okay, I got: "${content.substring(0, 20)}..."`, // This response should be translated or generic if needed
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
  
  useEffectReact(() => {
    const updatedChatsWithHints = mockContacts.map(contact => ({
      ...contact,
      avatarUrl: `${contact.avatarUrl.split('?')[0]}?${new URLSearchParams({"data-ai-hint": "person profile"}).toString()}`
    }));
    
    const updatedMessagesStoreWithHints = { ...mockMessagesStore };
    for (const chatId in updatedMessagesStoreWithHints) {
        updatedMessagesStoreWithHints[chatId] = updatedMessagesStoreWithHints[chatId].map(msg => {
            if (msg.avatarUrl) {
                const baseUrl = msg.avatarUrl.split('?')[0];
                return { ...msg, avatarUrl: `${baseUrl}?${new URLSearchParams({"data-ai-hint": "chat avatar"}).toString()}` };
            }
            return msg;
        });
    }
    setChats(updatedChatsWithHints);
    setMessagesStore(updatedMessagesStoreWithHints);
  }, []);


  const toggleBotConfigSheet = () => {
    setIsBotConfigSheetOpen(prev => !prev);
  };

  const toggleUserProfileSheet = () => {
    setIsUserProfileSheetOpen(prev => !prev);
  };

  if (isAuthenticated === null) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
        <Loader2 size={48} className="animate-spin text-primary" />
        <p className="ml-4 text-lg">{t('app.verifyingSession')}</p>
      </div>
    );
  }

  if (!isAuthenticated) {
     return null;
  }

  return (
    <div className="flex h-screen antialiased text-foreground bg-background overflow-hidden">
      <ChatList 
        chats={chats} 
        selectedChatId={selectedChatId} 
        onSelectChat={handleSelectChat}
        currentUser={currentUser}
        onToggleBotConfigSheet={toggleBotConfigSheet}
        onToggleUserProfileSheet={toggleUserProfileSheet}
        botConversationFlowSteps={botConversationFlowSteps}
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
            <h2 className="text-2xl font-semibold mb-2">{t('chat.selectChatPrompt')}</h2>
            <p className="text-lg">{t('chat.selectChatMessage')}</p>
            <p className="mt-4 text-sm">{t('chat.e2eEncryptionNotice')}</p>
          </div>
        )}
      </main>
      <BotConfigSheet 
        isOpen={isBotConfigSheetOpen} 
        onOpenChange={setIsBotConfigSheetOpen}
        flowSteps={botConversationFlowSteps}
        onFlowStepsChange={setBotConversationFlowSteps}
      />
      <UserProfileSheet
        isOpen={isUserProfileSheetOpen}
        onOpenChange={setIsUserProfileSheetOpen}
        currentUser={currentUser}
      />
    </div>
  );
}

