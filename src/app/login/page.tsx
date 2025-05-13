
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, LockKeyhole, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [step, setStep] = useState<'qr' | 'password'>('qr');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Redirect if already "authenticated" (simulated)
  useEffect(() => {
    if (localStorage.getItem('isAuthenticated') === 'true') {
      router.replace('/');
    }
  }, [router]);

  const handleQrScanned = () => {
    setIsLoading(true);
    // Simulate QR scan processing
    setTimeout(() => {
      setStep('password');
      setIsLoading(false);
      toast({
        title: "QR Code Scanned",
        description: "Please set your access password.",
      });
    }, 1500);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!password.trim()) {
      toast({
        variant: "destructive",
        title: "Password Required",
        description: "Please enter a password.",
      });
      return;
    }
    setIsLoading(true);
    // Simulate password validation and account setup
    setTimeout(() => {
      // In a real app, here you'd save the password hash, link QR data to user, etc.
      // For simulation, we just proceed to loading.
      router.push('/loading'); 
      // setIsLoading(false); // Not needed as we are navigating away
    }, 2000);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        {step === 'qr' && (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <QrCode size={40} className="text-primary" />
              </div>
              <CardTitle className="text-2xl">Scan QR Code</CardTitle>
              <CardDescription>
                Scan the QR code with your WhatsApp to link your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6">
              <div className="p-2 border rounded-lg bg-muted/20">
                <Image
                  src="https://picsum.photos/300/300"
                  alt="QR Code Placeholder"
                  width={280}
                  height={280}
                  className="rounded-md"
                  data-ai-hint="qrcode login"
                />
              </div>
              <Button 
                onClick={handleQrScanned} 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Scanning...
                  </>
                ) : "Simulate QR Scan"}
              </Button>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground text-center block">
              <p>This is a simulated QR scan. Click the button to proceed.</p>
            </CardFooter>
          </>
        )}

        {step === 'password' && (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                 <LockKeyhole size={40} className="text-primary" />
              </div>
              <CardTitle className="text-2xl">Set Access Password</CardTitle>
              <CardDescription>
                Create a password to secure your access to this web client.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="bg-input"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Setting Up...
                    </>
                  ) : (
                    <>
                      <LogIn size={18} className="mr-2" />
                      Confirm Password & Login
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
             <CardFooter className="text-xs text-muted-foreground text-center block">
              <p>Your password will be "saved" (simulated) for future logins.</p>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}
