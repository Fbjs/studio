
"use client";

import type { User } from "@/lib/types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { UserAvatar } from "@/components/chat/UserAvatar";
import { Award, Coins, LogOut, ArrowRight, Languages, Users, CalendarDays, Settings } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


interface UserProfileSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  currentUser: User;
}

export function UserProfileSheet({ isOpen, onOpenChange, currentUser }: UserProfileSheetProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { t, changeLanguage, locale } = useTranslation();

  const tokensUsed = currentUser.tokensUsed || 0;
  const tokensTotal = currentUser.tokensTotal || 0; // Default to 0 if undefined

  const tokensUsedPercent = tokensTotal > 0 
    ? Math.round((tokensUsed / tokensTotal) * 100)
    : 0;

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUserPlan');
    localStorage.removeItem('currentUserTokensTotal');
    localStorage.removeItem('currentUserTokensUsed');
    localStorage.removeItem('locale'); // Clear locale on logout
    toast({
      title: t('userProfile.logoutSuccessTitle'),
      description: t('userProfile.logoutSuccessDescription'),
    });
    onOpenChange(false); // Close the sheet
    changeLanguage('en'); // Reset to default language
    router.push('/login');
  };

  const handleNavigate = (path: string) => {
    onOpenChange(false); // Close the sheet
    router.push(path);
  };

  const handleLanguageChange = (newLocale: string) => {
    changeLanguage(newLocale);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="p-6 text-center">
          <div className="flex flex-col items-center mb-4">
            <UserAvatar src={currentUser.avatarUrl} alt={currentUser.name} size={80} className="mb-3" data-ai-hint="profile large"/>
            <SheetTitle className="text-2xl font-semibold">
              {currentUser.name}
            </SheetTitle>
            <SheetDescription className="mt-1 text-muted-foreground">
              {t('userProfile.description')}
            </SheetDescription>
          </div>
        </SheetHeader>
        
        <Separator />

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Language Selector Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center text-foreground">
              <Languages size={20} className="mr-2 text-primary" />
              {t('userProfile.language')}
            </h3>
            <div className="space-y-3 p-4 border rounded-lg bg-card shadow-sm">
              <Select value={locale} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('userProfile.language')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">{t('userProfile.english')}</SelectItem>
                  <SelectItem value="es">{t('userProfile.spanish')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Subscription Plan Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center text-foreground">
              <Award size={20} className="mr-2 text-primary" />
              {t('userProfile.currentPlan')}
            </h3>
            <div className="space-y-3 p-4 border rounded-lg bg-card shadow-sm">
              <div>
                <Label className="text-muted-foreground">{t('userProfile.currentPlan')}</Label>
                <p className="text-lg font-medium text-foreground mt-0.5">
                  {currentUser.planName ? t(`subscribe.plans.${currentUser.planName}.name`) : "N/A"}
                </p>
              </div>
              <Button 
                onClick={() => handleNavigate('/subscribe')}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {currentUser.planName === 'FREE' ? t('userProfile.upgradePlan') : t('userProfile.manageSubscription')}
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </div>

          {/* Token Usage Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center text-foreground">
              <Coins size={20} className="mr-2 text-primary" />
              {t('userProfile.tokenUsage')}
            </h3>
            <div className="space-y-3 p-4 border rounded-lg bg-card shadow-sm">
              {tokensTotal > 0 || currentUser.planName === 'ENTERPRISE' ? ( 
                <>
                  <div>
                    <div className="flex justify-between items-baseline mb-1">
                      <Label className="text-muted-foreground">{t('userProfile.tokensUsed')}</Label>
                      <p className="text-sm font-medium text-foreground">
                        {t('userProfile.tokensUsedOfTotal', {
                          tokensUsed: tokensUsed.toLocaleString(),
                          tokensTotal: currentUser.planName === 'ENTERPRISE' ? t('userProfile.enterpriseCustomTokens') : tokensTotal.toLocaleString()
                        })}
                      </p>
                    </div>
                    {currentUser.planName !== 'ENTERPRISE' && (
                       <Progress value={tokensUsedPercent} className="h-2.5" />
                    )}
                    {currentUser.planName !== 'ENTERPRISE' && (
                       <p className="text-xs text-muted-foreground mt-1.5 text-right">
                        {t('userProfile.tokensUsedPercent', {percent: tokensUsedPercent})}
                      </p>
                    )}
                  </div>
                  {currentUser.planName !== 'ENTERPRISE' && currentUser.planName !== 'FREE' && ( 
                    <Button variant="outline" className="w-full" onClick={() => handleNavigate('/subscribe')}>
                      {t('userProfile.getMoreTokens')}
                    </Button>
                  )}
                  {currentUser.planName === 'FREE' && tokensUsed >= tokensTotal && ( 
                     <Button variant="outline" className="w-full" onClick={() => handleNavigate('/subscribe')}>
                        {t('userProfile.getMoreTokens')}
                     </Button>
                  )}
                </>
              ) : (
                 currentUser.planName === 'FREE' && tokensTotal === 10 && tokensUsed === 0 ? (
                    <>
                     <div>
                        <div className="flex justify-between items-baseline mb-1">
                          <Label className="text-muted-foreground">{t('userProfile.tokensUsed')}</Label>
                           <p className="text-sm font-medium text-foreground">
                             {t('userProfile.tokensUsedOfTotal', {tokensUsed: tokensUsed.toLocaleString(), tokensTotal: tokensTotal.toLocaleString()})}
                          </p>
                        </div>
                        <Progress value={tokensUsedPercent} className="h-2.5" />
                        <p className="text-xs text-muted-foreground mt-1.5 text-right">
                           {t('userProfile.tokensUsedPercent', {percent: tokensUsedPercent})}
                        </p>
                      </div>
                       { tokensUsed >= tokensTotal && (
                         <Button variant="outline" className="w-full" onClick={() => handleNavigate('/subscribe')}>
                          {t('userProfile.getMoreTokens')}
                        </Button>
                       )}
                    </>
                 ) : (
                    <p className="text-muted-foreground text-sm">{t('userProfile.tokenInfoNotAvailable')}</p>
                 )
              )}
            </div>
          </div>

          {/* Admin Settings Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center text-foreground">
              <Settings size={20} className="mr-2 text-primary" />
              {t('userProfile.adminSettings.title')}
            </h3>
            <div className="space-y-3 p-4 border rounded-lg bg-card shadow-sm">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleNavigate('/admin/sales-executives')}
              >
                <Users size={18} className="mr-3 text-muted-foreground" />
                {t('userProfile.adminSettings.manageSalesExecutives')}
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleNavigate('/admin/schedules')}
              >
                <CalendarDays size={18} className="mr-3 text-muted-foreground" />
                {t('userProfile.adminSettings.manageSchedules')}
              </Button>
            </div>
          </div>

        </div>
        
        <Separator />

        <SheetFooter className="p-6 flex flex-col gap-2 sm:flex-row sm:justify-between">
          <Button variant="destructive" onClick={handleLogout} className="w-full sm:w-auto">
            <LogOut size={16} className="mr-2" />
            {t('userProfile.logout')}
          </Button>
          <SheetClose asChild>
            <Button variant="outline" className="w-full sm:w-auto mt-2 sm:mt-0">{t('userProfile.close')}</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
