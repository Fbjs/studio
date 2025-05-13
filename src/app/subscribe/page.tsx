
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Star, ArrowLeft, BadgePercent, Zap, Briefcase, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { PlanName } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';

interface Plan {
  id: PlanName;
  nameKey: string; // Key for translation
  priceKey: string; // Key for translation
  priceDetailsKey: string; // Key for translation
  tokensKey: string; // Key for translation
  featureKeys: string[]; // Keys for translation
  ctaTextKey: string; // Key for translation
  isPopular?: boolean;
  icon: React.ElementType;
  tierHighlightKey?: string; // Key for translation
}

// Define base plan data with keys for translation
const basePlansData: Plan[] = [
  {
    id: 'FREE',
    nameKey: 'subscribe.plans.FREE.name',
    priceKey: 'subscribe.plans.FREE.price',
    priceDetailsKey: 'subscribe.plans.FREE.priceDetails',
    tokensKey: 'subscribe.plans.FREE.tokens',
    featureKeys: [
      'subscribe.plans.FREE.features.0',
      'subscribe.plans.FREE.features.1',
      'subscribe.plans.FREE.features.2',
    ],
    ctaTextKey: 'subscribe.currentPlan',
    icon: BadgePercent,
  },
  {
    id: 'STARTER',
    nameKey: 'subscribe.plans.STARTER.name',
    priceKey: 'subscribe.plans.STARTER.price',
    priceDetailsKey: 'subscribe.plans.STARTER.priceDetails',
    tokensKey: 'subscribe.plans.STARTER.tokens',
    featureKeys: [
      'subscribe.plans.STARTER.features.0',
      'subscribe.plans.STARTER.features.1',
      'subscribe.plans.STARTER.features.2',
      'subscribe.plans.STARTER.features.3',
    ],
    ctaTextKey: 'subscribe.choosePlan',
    isPopular: true,
    icon: Zap,
    tierHighlightKey: 'subscribe.plans.STARTER.tierHighlight',
  },
  {
    id: 'BUSINESS',
    nameKey: 'subscribe.plans.BUSINESS.name',
    priceKey: 'subscribe.plans.BUSINESS.price',
    priceDetailsKey: 'subscribe.plans.BUSINESS.priceDetails',
    tokensKey: 'subscribe.plans.BUSINESS.tokens',
    featureKeys: [
      'subscribe.plans.BUSINESS.features.0',
      'subscribe.plans.BUSINESS.features.1',
      'subscribe.plans.BUSINESS.features.2',
      'subscribe.plans.BUSINESS.features.3',
      'subscribe.plans.BUSINESS.features.4',
    ],
    ctaTextKey: 'subscribe.choosePlan',
    icon: Briefcase,
    tierHighlightKey: 'subscribe.plans.BUSINESS.tierHighlight',
  },
  {
    id: 'ENTERPRISE',
    nameKey: 'subscribe.plans.ENTERPRISE.name',
    priceKey: 'subscribe.plans.ENTERPRISE.price',
    priceDetailsKey: 'subscribe.plans.ENTERPRISE.priceDetails',
    tokensKey: 'subscribe.plans.ENTERPRISE.tokens',
    featureKeys: [
      'subscribe.plans.ENTERPRISE.features.0',
      'subscribe.plans.ENTERPRISE.features.1',
      'subscribe.plans.ENTERPRISE.features.2',
      'subscribe.plans.ENTERPRISE.features.3',
      'subscribe.plans.ENTERPRISE.features.4',
    ],
    ctaTextKey: 'subscribe.contactSales',
    icon: Building,
    tierHighlightKey: 'subscribe.plans.ENTERPRISE.tierHighlight',
  },
];

export default function SubscribePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<PlanName | null>(null);

  useEffect(() => {
    const storedPlan = localStorage.getItem('currentUserPlan') as PlanName | null;
    setCurrentPlan(storedPlan || 'FREE');
  }, []);

  const plansData = useMemo(() => basePlansData.map(plan => ({
    ...plan,
    name: t(plan.nameKey),
    price: t(plan.priceKey),
    priceDetails: t(plan.priceDetailsKey),
    tokens: t(plan.tokensKey),
    features: plan.featureKeys.map(key => t(key)),
    ctaText: plan.id === 'ENTERPRISE' || plan.id === 'FREE' && currentPlan === 'FREE' ? t(plan.ctaTextKey) : t(plan.ctaTextKey, { planName: t(plan.nameKey) }),
    tierHighlight: plan.tierHighlightKey ? t(plan.tierHighlightKey) : undefined,
  })), [t, currentPlan]);


  const handleChoosePlan = (planId: PlanName) => {
    if (planId === currentPlan) return;

    if (planId === 'ENTERPRISE') {
      toast({
        title: t('subscribe.enterpriseInquiryTitle'),
        description: t('subscribe.enterpriseInquiryDescription'),
        variant: "default",
        duration: 5000,
      });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem('currentUserPlan', planId);
      let newTokensTotal = 0;
      switch (planId) {
        case 'FREE': newTokensTotal = 10; break;
        case 'STARTER': newTokensTotal = 5000; break;
        case 'BUSINESS': newTokensTotal = 20000; break;
      }
      localStorage.setItem('currentUserTokensTotal', newTokensTotal.toString());
      localStorage.setItem('currentUserTokensUsed', '0'); 

      toast({
        title: t('subscribe.subscriptionSuccessTitle', { planId: t(`subscribe.plans.${planId}.name`) }),
        description: t('subscribe.subscriptionSuccessDescription', { planId: t(`subscribe.plans.${planId}.name`) }),
        variant: "default",
        duration: 3000,
      });
      setIsLoading(false);
      router.push('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
      <header className="w-full max-w-5xl mb-12">
        <Button variant="outline" onClick={() => router.push('/')} className="mb-6">
          <ArrowLeft size={18} className="mr-2" />
          {t('subscribe.backToChat')}
        </Button>
        <h1 className="text-4xl font-bold text-center text-primary mb-2">{t('subscribe.pageTitle')}</h1>
        <p className="text-lg text-muted-foreground text-center">
          {t('subscribe.pageDescription')}
        </p>
      </header>

      <main className="w-full max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plansData.map((plan) => (
            <Card 
              key={plan.id} 
              className={cn(
                "flex flex-col shadow-xl hover:shadow-primary/30 transition-shadow duration-300",
                plan.isPopular ? "border-2 border-primary relative overflow-hidden" : "border-border",
                plan.id === currentPlan ? "bg-muted/30" : "bg-card"
              )}
            >
              {plan.isPopular && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold rounded-bl-md z-10 transform translate-x-0.5 -translate-y-0.5">
                  <Star size={12} className="inline mr-1 mb-0.5" /> {t('subscribe.popular')}
                </div>
              )}
              <CardHeader className="pb-4">
                <div className="flex items-center mb-3">
                   <plan.icon size={28} className="mr-3 text-primary" />
                   <CardTitle className="text-2xl">{plan.name}</CardTitle>
                </div>
                <div className="flex items-baseline">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  {plan.priceDetails && <span className="text-lg text-muted-foreground ml-1">{plan.priceDetails}</span>}
                </div>
                {plan.tierHighlight && <CardDescription className="mt-1 text-sm text-primary font-medium">{plan.tierHighlight}</CardDescription>}
                <CardDescription className="mt-1 text-sm h-10">
                  {t('subscribe.tokens', { tokens: plan.tokens })}
                </CardDescription>
              </CardHeader>
              <Separator className="mx-6"/>
              <CardContent className="pt-6 flex-grow">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle2 size={18} className="text-green-500 mr-2 mt-0.5 shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="mt-auto pt-6">
                <Button
                  onClick={() => handleChoosePlan(plan.id)}
                  className={cn(
                    "w-full text-base py-3",
                    plan.isPopular && plan.id !== currentPlan ? "bg-primary hover:bg-primary/90" : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                  )}
                  disabled={isLoading || plan.id === currentPlan}
                  aria-live="polite"
                >
                  {isLoading && plan.ctaTextKey !== 'subscribe.contactSales' ? t('subscribe.processing') : (plan.id === currentPlan ? t('subscribe.currentPlan') : plan.ctaText)}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <Separator className="my-12" />

        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">{t('subscribe.paymentInfoTitle')}</h3>
          <p className="text-muted-foreground mb-6">
            {t('subscribe.paymentInfoDescription')}
          </p>
          <div className="flex justify-center items-center space-x-6">
            <Image src="https://picsum.photos/seed/stripe/120/50" alt="Stripe Logo" width={120} height={50} className="rounded" data-ai-hint="payment logo" />
            <Image src="https://picsum.photos/seed/mercadopago/150/40" alt="Mercado Pago Logo" width={150} height={40} className="rounded" data-ai-hint="payment logo" />
          </div>
           <p className="text-xs text-muted-foreground mt-8">
            {t('subscribe.paymentInfoFooter')}
          </p>
        </div>
      </main>
    </div>
  );
}

const Image = ({ src, alt, width, height, className, "data-ai-hint": dataAiHint }: { src: string, alt: string, width: number, height: number, className?: string, "data-ai-hint"?: string }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src={src} alt={alt} width={width} height={height} className={className} data-ai-hint={dataAiHint} />
);
