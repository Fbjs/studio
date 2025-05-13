
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
import { Award, Coins, LogOut, ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface UserProfileSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  currentUser: User;
}

export function UserProfileSheet({ isOpen, onOpenChange, currentUser }: UserProfileSheetProps) {
  const router = useRouter();
  const { toast } = useToast();

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
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    onOpenChange(false); // Close the sheet
    router.push('/login');
  };

  const handleUpgradePlan = () => {
    onOpenChange(false); // Close the sheet
    router.push('/subscribe');
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
              Manage your profile, subscription, and token usage.
            </SheetDescription>
          </div>
        </SheetHeader>
        
        <Separator />

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Subscription Plan Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center text-foreground">
              <Award size={20} className="mr-2 text-primary" />
              Subscription Plan
            </h3>
            <div className="space-y-3 p-4 border rounded-lg bg-card shadow-sm">
              <div>
                <Label className="text-muted-foreground">Current Plan</Label>
                <p className="text-lg font-medium text-foreground mt-0.5">
                  {currentUser.planName || "N/A"}
                </p>
              </div>
              <Button 
                onClick={handleUpgradePlan}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {currentUser.planName === 'FREE' ? 'Upgrade Plan' : 'Manage Subscription'}
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </div>

          {/* Token Usage Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center text-foreground">
              <Coins size={20} className="mr-2 text-primary" />
              Token Usage
            </h3>
            <div className="space-y-3 p-4 border rounded-lg bg-card shadow-sm">
              {tokensTotal > 0 || currentUser.planName === 'ENTERPRISE' ? ( // Show even if total is 0 for Enterprise (custom)
                <>
                  <div>
                    <div className="flex justify-between items-baseline mb-1">
                      <Label className="text-muted-foreground">Tokens Used</Label>
                      <p className="text-sm font-medium text-foreground">
                        {tokensUsed.toLocaleString()} / {currentUser.planName === 'ENTERPRISE' ? 'Custom' : tokensTotal.toLocaleString()}
                      </p>
                    </div>
                    {currentUser.planName !== 'ENTERPRISE' && (
                       <Progress value={tokensUsedPercent} className="h-2.5" />
                    )}
                    {currentUser.planName !== 'ENTERPRISE' && (
                       <p className="text-xs text-muted-foreground mt-1.5 text-right">
                        {tokensUsedPercent}% used
                      </p>
                    )}
                  </div>
                  {currentUser.planName !== 'ENTERPRISE' && (
                    <Button variant="outline" className="w-full" onClick={handleUpgradePlan}>
                      Get More Tokens
                    </Button>
                  )}
                </>
              ) : (
                 currentUser.planName === 'FREE' && tokensTotal === 10 && tokensUsed === 0 ? (
                    <>
                     <div>
                        <div className="flex justify-between items-baseline mb-1">
                          <Label className="text-muted-foreground">Tokens Used</Label>
                           <p className="text-sm font-medium text-foreground">
                            {tokensUsed.toLocaleString()} / {tokensTotal.toLocaleString()}
                          </p>
                        </div>
                        <Progress value={tokensUsedPercent} className="h-2.5" />
                        <p className="text-xs text-muted-foreground mt-1.5 text-right">
                          {tokensUsedPercent}% used
                        </p>
                      </div>
                      <Button variant="outline" className="w-full" onClick={handleUpgradePlan}>
                        Get More Tokens
                      </Button>
                    </>
                 ) : (
                    <p className="text-muted-foreground text-sm">Token usage information not available for the current plan or an error occurred.</p>
                 )
              )}
            </div>
          </div>
        </div>
        
        <Separator />

        <SheetFooter className="p-6 flex flex-col gap-2 sm:flex-row sm:justify-between">
          <Button variant="destructive" onClick={handleLogout} className="w-full sm:w-auto">
            <LogOut size={16} className="mr-2" />
            Log Out
          </Button>
          <SheetClose asChild>
            <Button variant="outline" className="w-full sm:w-auto mt-2 sm:mt-0">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
