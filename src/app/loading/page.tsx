
"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react'; 
import { useTranslation } from '@/hooks/useTranslation';

export default function LoadingPage() {
  const [progress, setProgress] = useState(0);
  const { t } = useTranslation();
  const router = useRouter();

  // Memoize loadingMessages based on translations
  const loadingMessages = useMemo(() => {
    // Accessing loading.messages which should be an array in JSON
    const messages = t('loading.messages'); 
    if (Array.isArray(messages)) {
      return messages;
    }
    // Fallback if translations are not an array (e.g. not loaded yet or wrong format)
    return [
      "Initializing connection...",
      "Connecting to WhatsApp servers...",
      "Authenticating session...",
      "Fetching chat history (this might take a moment)...",
      "Decrypting recent messages...",
      "Loading contacts...",
      "Preparing your chat interface...",
      "Finalizing setup..."
    ];
  }, [t]);
  
  const [message, setMessage] = useState(loadingMessages[0]);


  useEffect(() => {
    const totalDuration = 7000; 
    const messageInterval = totalDuration / loadingMessages.length;
    let currentMessageIndex = 0;

    // Ensure initial message is set correctly based on potentially loaded translations
    setMessage(loadingMessages[0] || "Initializing connection...");


    const progressTimer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return Math.min(oldProgress + (100 / (totalDuration / 100)), 100);
      });
    }, 100);

    const messageTimer = setInterval(() => {
      currentMessageIndex++;
      if (currentMessageIndex < loadingMessages.length) {
        setMessage(loadingMessages[currentMessageIndex]);
      } else {
        clearInterval(messageTimer);
      }
    }, messageInterval);

    setTimeout(() => {
      localStorage.setItem('isAuthenticated', 'true'); 
      router.replace('/'); 
    }, totalDuration + 500); 

    return () => {
      clearInterval(progressTimer);
      clearInterval(messageTimer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, loadingMessages]); // Add loadingMessages to dependency array

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-foreground">
      <div className="w-full max-w-md text-center space-y-6 p-8 bg-card rounded-xl shadow-2xl">
        <Loader2 size={64} className="mx-auto animate-spin text-primary mb-6" />
        <h1 className="text-3xl font-semibold">{t('loading.title')}</h1>
        <p className="text-muted-foreground min-h-[40px]">
          {message}
        </p>
        <Progress value={progress} className="w-full h-3" />
        <p className="text-sm text-muted-foreground mt-2">{t('loading.progressPercent', { progress: Math.round(progress) })}</p>
      </div>
    </div>
  );
}
