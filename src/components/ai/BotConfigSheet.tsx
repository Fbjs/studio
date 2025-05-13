
"use client";

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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Settings, Link2 } from "lucide-react";

interface BotConfigSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  // currentUser?: User; // Future: if needed for context
}

export function BotConfigSheet({ isOpen, onOpenChange }: BotConfigSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader className="p-6">
          <SheetTitle className="flex items-center text-2xl">
            <Bot size={28} className="mr-3 text-primary" />
            AI Bot Configuration
          </SheetTitle>
          <SheetDescription className="mt-1">
            Manage and set up AI-powered bots to assist with your conversations.
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Settings size={20} className="mr-2 text-muted-foreground" />
              General Bot Settings
            </h3>
            <div className="space-y-4 p-4 border rounded-lg bg-card">
              <div>
                <Label htmlFor="bot-name">Bot Name</Label>
                <Input id="bot-name" placeholder="e.g., Support Helper" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="bot-persona">Bot Persona/Instructions</Label>
                <Textarea 
                  id="bot-persona" 
                  placeholder="Describe the bot's role and how it should behave. e.g., 'You are a friendly support agent that helps with product queries.'" 
                  className="mt-1 min-h-[100px]" 
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Link2 size={20} className="mr-2 text-muted-foreground" />
              Conversation Linking
            </h3>
            <div className="space-y-4 p-4 border rounded-lg bg-card">
               <p className="text-sm text-muted-foreground">
                Specify which conversations or types of queries this bot should handle. 
                (This section is a placeholder for more complex linking logic).
              </p>
              <div>
                <Label htmlFor="keywords">Keywords to Trigger Bot</Label>
                <Input id="keywords" placeholder="e.g., help, support, pricing" className="mt-1" />
                 <p className="text-xs text-muted-foreground mt-1">Comma-separated keywords.</p>
              </div>
            </div>
          </div>

           <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              More advanced AI configurations will be available here in the future.
            </p>
          </div>
        </div>

        <SheetFooter className="p-6 border-t">
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button type="submit" className="bg-primary hover:bg-primary/90">
            Save Configuration
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
