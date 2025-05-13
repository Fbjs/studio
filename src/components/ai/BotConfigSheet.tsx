
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
import { useTranslation } from "@/hooks/useTranslation";


interface BotConfigSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function BotConfigSheet({ isOpen, onOpenChange }: BotConfigSheetProps) {
  const { t } = useTranslation();

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader className="p-6">
          <SheetTitle className="flex items-center text-2xl">
            <Bot size={28} className="mr-3 text-primary" />
            {t('botConfig.title')}
          </SheetTitle>
          <SheetDescription className="mt-1">
            {t('botConfig.description')}
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Settings size={20} className="mr-2 text-muted-foreground" />
              {t('botConfig.generalSettings')}
            </h3>
            <div className="space-y-4 p-4 border rounded-lg bg-card">
              <div>
                <Label htmlFor="bot-name">{t('botConfig.botNameLabel')}</Label>
                <Input id="bot-name" placeholder={t('botConfig.botNamePlaceholder')} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="bot-persona">{t('botConfig.botPersonaLabel')}</Label>
                <Textarea 
                  id="bot-persona" 
                  placeholder={t('botConfig.botPersonaPlaceholder')}
                  className="mt-1 min-h-[100px]" 
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Link2 size={20} className="mr-2 text-muted-foreground" />
              {t('botConfig.conversationLinking')}
            </h3>
            <div className="space-y-4 p-4 border rounded-lg bg-card">
               <p className="text-sm text-muted-foreground">
                {t('botConfig.linkingDescription')}
              </p>
              <div>
                <Label htmlFor="keywords">{t('botConfig.keywordsLabel')}</Label>
                <Input id="keywords" placeholder={t('botConfig.keywordsPlaceholder')} className="mt-1" />
                 <p className="text-xs text-muted-foreground mt-1">{t('botConfig.keywordsHelpText')}</p>
              </div>
            </div>
          </div>

           <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              {t('botConfig.advancedConfigNotice')}
            </p>
          </div>
        </div>

        <SheetFooter className="p-6 border-t">
          <SheetClose asChild>
            <Button variant="outline">{t('botConfig.cancel')}</Button>
          </SheetClose>
          <Button type="submit" className="bg-primary hover:bg-primary/90">
            {t('botConfig.saveConfiguration')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
