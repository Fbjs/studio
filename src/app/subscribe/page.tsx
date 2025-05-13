
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Star, ArrowLeft, BadgePercent, Zap, Briefcase, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { PlanName } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface Plan {
  id: PlanName;
  name: string;
  price: string;
  priceDetails: string;
  tokens: string;
  features: string[];
  ctaText: string;
  isPopular?: boolean;
  icon: React.ElementType;
  tierHighlight?: string;
}

const plansData: Plan[] = [
  {
    id: 'FREE',
    name: 'Free',
    price: '$0',
    priceDetails: 'Forever',
    tokens: '10 (One-time)',
    features: [
      'Basic chat functionality',
      'Limited AI bot interactions',
      'End-to-end encryption (simulated)',
    ],
    ctaText: 'Current Plan',
    icon: BadgePercent,
  },
  {
    id: 'STARTER',
    name: 'Starter',
    price: '$10',
    priceDetails: '/ month',
    tokens: '5,000 / month',
    features: [
      'All FREE features',
      'Standard AI bot access',
      'Up to 1 custom bot configuration',
      'Expanded message history',
    ],
    ctaText: 'Choose Starter',
    isPopular: true,
    icon: Zap,
    tierHighlight: "Best value for individuals",
  },
  {
    id: 'BUSINESS',
    name: 'Business',
    price: '$30',
    priceDetails: '/ month',
    tokens: '20,000 / month',
    features: [
      'All STARTER features',
      'Advanced AI bot capabilities',
      'Up to 5 custom bot configurations',
      'Priority support',
      'Team features (coming soon)',
    ],
    ctaText: 'Choose Business',
    icon: Briefcase,
    tierHighlight: "Perfect for small teams",
  },
  {
    id: 'ENTERPRISE',
    name: 'Enterprise',
    price: 'Custom',
    priceDetails: '',
    tokens: 'Unlimited / Custom',
    features: [
      'All BUSINESS features',
      'Dedicated AI model fine-tuning',
      'Unlimited bot configurations',
      'Dedicated account manager & SLA',
      'Custom integrations',
    ],
    ctaText: 'Contact Sales',
    icon: Building,
    tierHighlight: "Tailored for large organizations",
  },
];

export default function SubscribePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<PlanName | null>(null);

  useEffect(() => {
    const storedPlan = localStorage.getItem('currentUserPlan') as PlanName | null;
    setCurrentPlan(storedPlan || 'FREE'); // Default to FREE if nothing is stored or on initial load
  }, []);

  const handleChoosePlan = (planId: PlanName) => {
    if (planId === currentPlan) return; // Do nothing if it's the current plan

    if (planId === 'ENTERPRISE') {
      toast({
        title: "Enterprise Inquiry",
        description: "Thank you for your interest! Please contact our sales team for a custom quote.",
        variant: "default",
        duration: 5000,
      });
      // Optionally, redirect to a contact page or show contact info
      // router.push('/contact-sales');
      return;
    }

    setIsLoading(true);
    // Simulate API call for subscription change
    setTimeout(() => {
      localStorage.setItem('currentUserPlan', planId);
      let newTokensTotal = 0;
      switch (planId) {
        case 'FREE': newTokensTotal = 10; break;
        case 'STARTER': newTokensTotal = 5000; break;
        case 'BUSINESS': newTokensTotal = 20000; break;
        // ENTERPRISE is handled above
      }
      localStorage.setItem('currentUserTokensTotal', newTokensTotal.toString());
      localStorage.setItem('currentUserTokensUsed', '0'); // Reset used tokens

      toast({
        title: `Successfully Subscribed to ${planId}!`,
        description: `You are now on the ${planId} plan. Redirecting to your chats...`,
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
          Back to Chat
        </Button>
        <h1 className="text-4xl font-bold text-center text-primary mb-2">Choose Your Plan</h1>
        <p className="text-lg text-muted-foreground text-center">
          Flexible plans for individuals and teams. Unlock more features and AI power.
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
                  <Star size={12} className="inline mr-1 mb-0.5" /> Popular
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
                  Tokens: {plan.tokens}
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
                  {isLoading && plan.ctaText !== 'Contact Sales' ? 'Processing...' : (plan.id === currentPlan ? 'Current Plan' : plan.ctaText)}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <Separator className="my-12" />

        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">Payment Information</h3>
          <p className="text-muted-foreground mb-6">
            We partner with Stripe and Mercado Pago for secure payment processing.
            (This is a simulation - no actual payment will be processed).
          </p>
          <div className="flex justify-center items-center space-x-6">
            <Image src="https://picsum.photos/seed/stripe/120/50" alt="Stripe Logo" width={120} height={50} className="rounded" data-ai-hint="payment logo" />
            <Image src="https://picsum.photos/seed/mercadopago/150/40" alt="Mercado Pago Logo" width={150} height={40} className="rounded" data-ai-hint="payment logo" />
          </div>
           <p className="text-xs text-muted-foreground mt-8">
            All transactions are secured and encrypted. For questions about billing, please contact support.
          </p>
        </div>
      </main>
    </div>
  );
}

// Dummy Image component for placeholder - next/image might complain in some setups without proper loader for external URLs if not configured.
// For picsum, it should be fine with next.config.ts setup.
const Image = ({ src, alt, width, height, className, "data-ai-hint": dataAiHint }: { src: string, alt: string, width: number, height: number, className?: string, "data-ai-hint"?: string }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src={src} alt={alt} width={width} height={height} className={className} data-ai-hint={dataAiHint} />
);
