
"use client";

import { useState, type KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SendHorizonal, Paperclip } from 'lucide-react'; 
import { useTranslation } from '@/hooks/useTranslation';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
}

export function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const { t } = useTranslation();

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t border-border bg-background flex items-center gap-2">
      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent">
        <Paperclip size={20} />
        <span className="sr-only">{t('chat.attachFile')}</span>
      </Button>
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={t('chat.typeMessagePlaceholder')}
        className="flex-1 resize-none bg-input border-none focus-visible:ring-1 focus-visible:ring-ring min-h-[40px] max-h-[120px] rounded-full py-2 px-4"
        rows={1}
      />
      <Button onClick={handleSend} size="icon" className="bg-primary hover:bg-primary/90 rounded-full w-10 h-10" disabled={!message.trim()}>
        <SendHorizonal size={20} className="text-primary-foreground" />
        <span className="sr-only">{t('chat.sendMessage')}</span>
      </Button>
    </div>
  );
}
