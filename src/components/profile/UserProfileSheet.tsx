
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
import { Award, Coins, UserCircle2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface UserProfileSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  currentUser: User;
}

export function UserProfileSheet({ isOpen, onOpenChange, currentUser }: UserProfileSheetProps) {
  const tokensUsedPercent = currentUser.tokensTotal && currentUser.tokensTotal > 0 
    ? Math.round(((currentUser.tokensUsed || 0) / currentUser.tokensTotal) * 100)
    : 0;

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
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled>
                Upgrade Plan (Coming Soon)
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
              {currentUser.tokensTotal !== undefined && currentUser.tokensUsed !== undefined ? (
                <>
                  <div>
                    <div className="flex justify-between items-baseline mb-1">
                      <Label className="text-muted-foreground">Tokens Used</Label>
                      <p className="text-sm font-medium text-foreground">
                        {currentUser.tokensUsed.toLocaleString()} / {currentUser.tokensTotal.toLocaleString()}
                      </p>
                    </div>
                    <Progress value={tokensUsedPercent} className="h-2.5" />
                    <p className="text-xs text-muted-foreground mt-1.5 text-right">
                      {tokensUsedPercent}% used
                    </p>
                  </div>
                  <Button variant="outline" className="w-full" disabled>
                    Buy More Tokens (Coming Soon)
                  </Button>
                </>
              ) : (
                <p className="text-muted-foreground text-sm">Token usage information not available.</p>
              )}
            </div>
          </div>
        </div>

        <SheetFooter className="p-6 border-t mt-auto">
          <SheetClose asChild>
            <Button variant="outline" className="w-full">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
