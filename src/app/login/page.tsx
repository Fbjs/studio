
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, LockKeyhole, LogIn, Smartphone, Users, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type LoginStep = 'initial' | 'qr' | 'phone' | 'password';

export default function LoginPage() {
  const [step, setStep] = useState<LoginStep>('initial');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isNewUserFlow, setIsNewUserFlow] = useState(false); // To differentiate password step context
  const router = useRouter();
  const { toast } = useToast();

  // Redirect if already "authenticated" (simulated)
  useEffect(() => {
    if (localStorage.getItem('isAuthenticated') === 'true') {
      router.replace('/');
    }
  }, [router]);

  const handleSelectNewUser = () => {
    setIsNewUserFlow(true);
    setStep('qr');
  };

  const handleSelectExistingUser = () => {
    setIsNewUserFlow(false);
    setStep('phone');
  };

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

  const handlePhoneSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      toast({
        variant: "destructive",
        title: "Phone Number Required",
        description: "Please enter your phone number.",
      });
      return;
    }
    setIsLoading(true);
    // Simulate phone number validation
    setTimeout(() => {
      setStep('password');
      setIsLoading(false);
      toast({
        title: "Phone Number Entered",
        description: "Please enter your password.",
      });
    }, 1500);
  };

  const handleLoginOrSetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
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
    // Simulate password validation / account setup
    setTimeout(() => {
      router.push('/loading'); 
    }, 2000);
  };

  const renderSpinner = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        {step === 'initial' && (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <Users size={40} className="text-primary" />
              </div>
              <CardTitle className="text-2xl">Welcome to DarkWhisper</CardTitle>
              <CardDescription>
                How would you like to log in?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleSelectNewUser} className="w-full" variant="outline">
                <QrCode size={18} className="mr-2" />
                New User - Link with QR Code
              </Button>
              <Button onClick={handleSelectExistingUser} className="w-full">
                <LogIn size={18} className="mr-2" />
                Existing User - Login
              </Button>
            </CardContent>
             <CardFooter className="text-xs text-muted-foreground text-center block pt-4">
              <p>Choose an option to proceed.</p>
            </CardFooter>
          </>
        )}

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
                    {renderSpinner()}
                    Scanning...
                  </>
                ) : "Simulate QR Scan"}
              </Button>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground text-center block">
              <p>This is a simulated QR scan. Click the button to proceed.</p>
              <Button variant="link" size="sm" onClick={() => setStep('initial')} className="mt-2">Back</Button>
            </CardFooter>
          </>
        )}

        {step === 'phone' && (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                 <Smartphone size={40} className="text-primary" />
              </div>
              <CardTitle className="text-2xl">Enter Your Phone Number</CardTitle>
              <CardDescription>
                Please enter your registered phone number to continue.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePhoneSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g., +1 555 123 4567"
                    required
                    className="bg-input"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      {renderSpinner()}
                      Verifying...
                    </>
                  ) : (
                    <>
                      <ArrowRight size={18} className="mr-2" />
                      Continue
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
             <CardFooter className="text-xs text-muted-foreground text-center block">
              <p>We'll "verify" your phone number (simulated).</p>
              <Button variant="link" size="sm" onClick={() => setStep('initial')} className="mt-2">Back</Button>
            </CardFooter>
          </>
        )}

        {step === 'password' && (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                 <LockKeyhole size={40} className="text-primary" />
              </div>
              <CardTitle className="text-2xl">
                {isNewUserFlow ? "Set Access Password" : "Enter Your Password"}
              </CardTitle>
              <CardDescription>
                {isNewUserFlow 
                  ? "Create a password to secure your access to this web client."
                  : "Enter your password to access your account."
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLoginOrSetPassword} className="space-y-6">
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
                      {renderSpinner()}
                      {isNewUserFlow ? "Setting Up..." : "Logging In..."}
                    </>
                  ) : (
                    <>
                      <LogIn size={18} className="mr-2" />
                      {isNewUserFlow ? "Confirm Password & Login" : "Login"}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
             <CardFooter className="text-xs text-muted-foreground text-center block">
              <p>
                {isNewUserFlow 
                  ? "Your password will be 'saved' (simulated) for future logins."
                  : "Ensure your password is correct."
                }
              </p>
              <Button variant="link" size="sm" onClick={() => setStep(isNewUserFlow ? 'qr' : 'phone')} className="mt-2">Back</Button>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}
