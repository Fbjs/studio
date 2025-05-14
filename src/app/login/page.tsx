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
import { useTranslation } from '@/hooks/useTranslation';

type LoginStep = 'initial' | 'qr' | 'phone' | 'password';

export default function LoginPage() {
  const [step, setStep] = useState<LoginStep>('initial');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
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
    setTimeout(() => {
      setStep('password');
      setIsLoading(false);
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
      setStep('password');
      setIsLoading(false);
      toast({
        title: t('login.phoneEnteredToastTitle'),
        description: t('login.phoneEnteredToastDescription'),
      });
    }, 1500);
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

    try {
        const response = await fetch('http://localhost:3000/api/users/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                phoneNumber, // Número de teléfono ingresado
                password,    // Contraseña ingresada
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            toast({
                variant: "destructive",
                title: t('login.loginFailed'),
                description: errorData.message || t('login.genericError'),
            });
            setIsLoading(false);
            return;
        }

        const data = await response.json();

        // Guardar el token en localStorage o manejarlo según sea necesario
        localStorage.setItem('token', data.token);
        localStorage.setItem('isAuthenticated', 'true');

        toast({
            title: t('login.success'),
            description: t('login.welcomeBack'),
        });

        // Redirigir al usuario a la página principal
        router.push('/');
    } catch (error) {
        console.error('❌ Error en el login:', error);
        toast({
            variant: "destructive",
            title: t('login.genericError'),
            description: t('login.serverError'),
        });
    } finally {
        setIsLoading(false);
    }
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
            <CardContent className="space-y-4">
              <Button onClick={handleSelectNewUser} className="w-full" variant="outline">
                <QrCode size={18} className="mr-2" />
                {t('login.newUserQR')}
              </Button>
              <Button onClick={handleSelectExistingUser} className="w-full">
                <LogIn size={18} className="mr-2" />
                {t('login.existingUserLogin')}
              </Button>
            </CardContent>
             <CardFooter className="text-xs text-muted-foreground text-center block pt-4">
              <p>{t('login.chooseOption')}</p>
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
                {qrCode ? (
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrCode)}&size=300x300`}
                    alt="QR Code"
                    width={280}
                    height={280}
                    className="rounded-md"
                  />
                ) : (
                  <p>{t('login.loadingQR')}</p>
                )}
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
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('login.passwordPlaceholder')}
                    required
                    className="bg-input"
                  />
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
              <Button variant="link" size="sm" onClick={() => setStep(isNewUserFlow ? 'qr' : 'phone')} className="mt-2">{t('login.back')}</Button>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}
