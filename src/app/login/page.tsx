"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, LockKeyhole, LogIn, Smartphone, Users, ArrowRight, UserPlus, ClipboardEdit, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';

type LoginStep = 'initial' | 'qr' | 'phone' | 'password' | 'register';

export default function LoginPage() {
  const [step, setStep] = useState<LoginStep>('initial');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isNewUserFlow, setIsNewUserFlow] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [qrInterval, setQrInterval] = useState<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    if (localStorage.getItem('isAuthenticated') === 'true') {
      setStep('password');
    }
  }, [step]);

  const fetchQrCode = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/whatsapp/qr');
      if (response.ok) {
        const data = await response.json();
        setQrCode(data.qrCode);
      } else {
        console.error('Error al obtener el QR:', response.statusText);
      }
    } catch (error) {
      console.error('Error al obtener el QR:', error);
    }
  };

  useEffect(() => {
    if (step === 'qr') {
      fetchQrCode();
      const interval = setInterval(fetchQrCode, 30000);
      setQrInterval(interval);

      return () => {
        clearInterval(interval);
      };
    }
  }, [step]);

  const handleSelectNewUserQR = () => {
    setIsNewUserFlow(true);
    setStep('qr');
  };

  const handleSelectExistingUser = () => {
    setIsNewUserFlow(false);
    setStep('phone');
  };

  const handleSelectRegister = () => {
    setIsNewUserFlow(true); // Registration is a new user flow
    setStep('register');
    // Clear fields for registration form
    setPhoneNumber('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleQrScanned = () => {
    setIsLoading(true);
    setTimeout(() => {
      setStep('password'); // Proceed to set a password for the app
      setIsLoading(false);
      setShowPassword(false);
      toast({
        title: t('login.qrScannedToastTitle'),
        description: t('login.qrScannedToastDescription'),
      });
    }, 1500);
  };

  const handlePhoneSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      toast({
        variant: "destructive",
        title: t('login.phoneRequiredError'),
        description: t('login.phoneRequiredErrorDesc'),
      });
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setStep('password'); // Proceed to enter password for existing user
      setIsLoading(false);
      setShowPassword(false);
      toast({
        title: t('login.phoneEnteredToastTitle'),
        description: t('login.phoneEnteredToastDescription'),
      });
    }, 1500);
  };

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      toast({ variant: "destructive", title: t('login.phoneRequiredError'), description: t('login.phoneRequiredErrorDesc') });
      return;
    }
    if (!password.trim()) {
      toast({ variant: "destructive", title: t('login.passwordRequiredError'), description: t('login.passwordRequiredErrorDesc') });
      return;
    }
    if (password !== confirmPassword) {
      toast({ variant: "destructive", title: t('login.passwordsDontMatchError'), description: t('login.passwordsDontMatchErrorDesc') });
      return;
    }
    setIsLoading(true);
    // Simulate API call for registration
    setTimeout(() => {
      // In a real app, you'd get a token or session here.
      // The /loading page handles setting isAuthenticated.
      router.push('/loading');
    }, 2000);
  };

  const handleLoginOrSetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!password.trim()) {
        toast({
            variant: "destructive",
            title: t('login.passwordRequiredError'),
            description: t('login.passwordRequiredErrorDesc'),
        });
        return;
    }

    setIsLoading(true);
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
              <CardTitle className="text-2xl">{t('login.welcome')}</CardTitle>
              <CardDescription>
                {t('login.howToLogin')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={handleSelectNewUserQR} className="w-full" variant="outline">
                <QrCode size={18} className="mr-2" />
                {t('login.newUserQR')}
              </Button>
              <Button onClick={handleSelectExistingUser} className="w-full">
                <LogIn size={18} className="mr-2" />
                {t('login.existingUserLogin')}
              </Button>
              <Button onClick={handleSelectRegister} className="w-full" variant="secondary">
                <UserPlus size={18} className="mr-2" />
                {t('login.registerButtonInitial')}
              </Button>
            </CardContent>
             <CardFooter className="text-xs text-muted-foreground text-center block pt-4">
              <p>{t('login.chooseOption')}</p>
            </CardFooter>
          </>
        )}

        {step === 'register' && (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                 <UserPlus size={40} className="text-primary" />
              </div>
              <CardTitle className="text-2xl">{t('login.registerTitle')}</CardTitle>
              <CardDescription>
                {t('login.registerDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="reg-phone">{t('login.phoneNumberLabel')}</Label>
                  <Input
                    id="reg-phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder={t('login.phoneNumberPlaceholder')}
                    required
                    className="bg-input"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="reg-password">{t('login.passwordLabel')}</Label>
                  <div className="relative">
                    <Input
                      id="reg-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t('login.passwordPlaceholder')}
                      required
                      className="bg-input pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="reg-confirm-password">{t('login.confirmPasswordLabel')}</Label>
                  <div className="relative">
                    <Input
                      id="reg-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={t('login.confirmPasswordPlaceholder')}
                      required
                      className="bg-input pr-10"
                    />
                     <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      {renderSpinner()}
                      {t('login.registering')}
                    </>
                  ) : (
                    <>
                      <ClipboardEdit size={18} className="mr-2" />
                      {t('login.registerAndLoginButton')}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
             <CardFooter className="text-xs text-muted-foreground text-center block">
              <p>{t('login.registerInfo')}</p>
              <Button variant="link" size="sm" onClick={() => setStep('initial')} className="mt-2">{t('login.back')}</Button>
            </CardFooter>
          </>
        )}

        {step === 'qr' && (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <QrCode size={40} className="text-primary" />
              </div>
              <CardTitle className="text-2xl">{t('login.scanQRTitle')}</CardTitle>
              <CardDescription>
                {t('login.scanQRDescription')}
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
                    {t('login.scanning')}
                  </>
                ) : t('login.simulateQRScan')}
              </Button>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground text-center block">
              <p>{t('login.qrScanInfo')}</p>
              <Button variant="link" size="sm" onClick={() => setStep('initial')} className="mt-2">{t('login.back')}</Button>
            </CardFooter>
          </>
        )}

        {step === 'phone' && (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                 <Smartphone size={40} className="text-primary" />
              </div>
              <CardTitle className="text-2xl">{t('login.enterPhoneTitle')}</CardTitle>
              <CardDescription>
                {t('login.enterPhoneDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePhoneSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">{t('login.phoneNumberLabel')}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder={t('login.phoneNumberPlaceholder')}
                    required
                    className="bg-input"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      {renderSpinner()}
                      {t('login.verifying')}
                    </>
                  ) : (
                    <>
                      <ArrowRight size={18} className="mr-2" />
                      {t('login.continue')}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
             <CardFooter className="text-xs text-muted-foreground text-center block">
              <p>{t('login.phoneVerificationInfo')}</p>
              <Button variant="link" size="sm" onClick={() => setStep('initial')} className="mt-2">{t('login.back')}</Button>
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
                {isNewUserFlow ? t('login.setPasswordTitle') : t('login.enterPasswordTitle')}
              </CardTitle>
              <CardDescription>
                {isNewUserFlow 
                  ? t('login.setPasswordDescription')
                  : t('login.enterPasswordDescription')
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLoginOrSetPassword} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="password">{t('login.passwordLabel')}</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t('login.passwordPlaceholder')}
                      required
                      className="bg-input pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      {renderSpinner()}
                      {isNewUserFlow ? t('login.settingUp') : t('login.loggingIn')}
                    </>
                  ) : (
                    <>
                      <LogIn size={18} className="mr-2" />
                      {isNewUserFlow ? t('login.confirmPasswordAndLogin') : t('login.loginButton')}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
             <CardFooter className="text-xs text-muted-foreground text-center block">
              <p>
                {isNewUserFlow 
                  ? t('login.setPasswordInfo')
                  : t('login.enterPasswordInfo')
                }
              </p>
              {/* For QR flow, back goes to QR. For phone login, back goes to phone. */}
              <Button variant="link" size="sm" onClick={() => setStep(isNewUserFlow ? 'qr' : 'phone')} className="mt-2">{t('login.back')}</Button>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}

