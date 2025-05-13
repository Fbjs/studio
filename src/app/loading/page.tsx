
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react'; // Using Loader2 for a spinner

export default function LoadingPage() {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Initializing connection...");
  const router = useRouter();

  const loadingMessages = [
    "Connecting to WhatsApp servers...",
    "Authenticating session...",
    "Fetching chat history (this might take a moment)...",
    "Decrypting recent messages...",
    "Loading contacts...",
    "Preparing your chat interface...",
    "Finalizing setup...",
  ];

  useEffect(() => {
    const totalDuration = 7000; // Simulate 7 seconds loading time
    const messageInterval = totalDuration / loadingMessages.length;
    let currentMessageIndex = 0;

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

    // Simulate completion
    setTimeout(() => {
      localStorage.setItem('isAuthenticated', 'true'); // Simulate successful authentication
      router.replace('/'); // Use replace to avoid this page in history
    }, totalDuration + 500); // Add a small buffer

    return () => {
      clearInterval(progressTimer);
      clearInterval(messageTimer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]); // Removed loadingMessages from deps as it's constant

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-foreground">
      <div className="w-full max-w-md text-center space-y-6 p-8 bg-card rounded-xl shadow-2xl">
        <Loader2 size={64} className="mx-auto animate-spin text-primary mb-6" />
        <h1 className="text-3xl font-semibold">Loading Your Chats</h1>
        <p className="text-muted-foreground min-h-[40px]">
          {message}
        </p>
        <Progress value={progress} className="w-full h-3" />
        <p className="text-sm text-muted-foreground mt-2">{Math.round(progress)}%</p>
      </div>
    </div>
  );
}
