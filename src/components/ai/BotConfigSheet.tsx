
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
import { Bot, Settings, Link2, CalendarClock } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


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

          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <CalendarClock size={20} className="mr-2 text-muted-foreground" />
              {t('botConfig.appointmentScheduling.title')}
            </h3>
            <div className="space-y-4 p-4 border rounded-lg bg-card">
              <div className="flex items-center justify-between">
                <Label htmlFor="enable-scheduling" className="flex flex-col space-y-1">
                  <span>{t('botConfig.appointmentScheduling.enableBotScheduling')}</span>
                  <span className="font-normal leading-snug text-muted-foreground text-xs">
                    {t('botConfig.appointmentScheduling.enableBotSchedulingDesc')}
                  </span>
                </Label>
                <Switch id="enable-scheduling" />
              </div>
              <div>
                <Label htmlFor="default-duration">{t('botConfig.appointmentScheduling.defaultDurationLabel')}</Label>
                <Select defaultValue="30">
                  <SelectTrigger id="default-duration" className="mt-1">
                    <SelectValue placeholder={t('botConfig.appointmentScheduling.defaultDurationPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">{t('botConfig.appointmentScheduling.durationMinutes', {count: 15})}</SelectItem>
                    <SelectItem value="30">{t('botConfig.appointmentScheduling.durationMinutes', {count: 30})}</SelectItem>
                    <SelectItem value="45">{t('botConfig.appointmentScheduling.durationMinutes', {count: 45})}</SelectItem>
                    <SelectItem value="60">{t('botConfig.appointmentScheduling.durationMinutes', {count: 60})}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="appointment-services">{t('botConfig.appointmentScheduling.servicesLabel')}</Label>
                <Input id="appointment-services" placeholder={t('botConfig.appointmentScheduling.servicesPlaceholder')} className="mt-1" />
                <p className="text-xs text-muted-foreground mt-1">{t('botConfig.appointmentScheduling.servicesHelpText')}</p>
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
