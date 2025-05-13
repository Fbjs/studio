
"use client";

import { useState } from "react";
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
import { Bot, Settings, Link2, CalendarClock, ListOrdered, PlusCircle, Trash2 } from "lucide-react";
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
  const [flowSteps, setFlowSteps] = useState<string[]>([
    t('botConfig.conversationFlow.exampleSteps.0'), // Saludo
    t('botConfig.conversationFlow.exampleSteps.1'), // Consultar datos del cliente
    t('botConfig.conversationFlow.exampleSteps.2'), // Escuchar lo que busca el cliente
    t('botConfig.conversationFlow.exampleSteps.3')  // Responder
  ]);
  const [newFlowStep, setNewFlowStep] = useState('');

  const handleAddFlowStep = () => {
    if (newFlowStep.trim()) {
      setFlowSteps(prev => [...prev, newFlowStep.trim()]);
      setNewFlowStep('');
    }
  };

  const handleRemoveFlowStep = (indexToRemove: number) => {
    setFlowSteps(prev => prev.filter((_, index) => index !== indexToRemove));
  };

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
          
          {/* Bot Conversation Flow Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <ListOrdered size={20} className="mr-2 text-muted-foreground" />
              {t('botConfig.conversationFlow.title')}
            </h3>
            <div className="space-y-4 p-4 border rounded-lg bg-card">
              <p className="text-sm text-muted-foreground">
                {t('botConfig.conversationFlow.description')}
              </p>
              <div className="space-y-2">
                {flowSteps.map((step, index) => (
                  <div key={index} className="flex items-center justify-between p-2 pr-1 border rounded-md bg-muted/30 hover:bg-muted/50 transition-colors">
                    <span className="text-sm flex-1 break-words">{index + 1}. {step}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleRemoveFlowStep(index)} 
                      aria-label={t('botConfig.conversationFlow.removeStepButton')}
                      className="shrink-0 ml-2 h-8 w-8"
                    >
                      <Trash2 size={16} className="text-destructive" />
                    </Button>
                  </div>
                ))}
                {flowSteps.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-2">
                    {t('botConfig.conversationFlow.emptyFlow')}
                  </p>
                )}
              </div>
              <div className="flex gap-2 items-center pt-2">
                <Input
                  id="new-flow-step"
                  value={newFlowStep}
                  onChange={(e) => setNewFlowStep(e.target.value)}
                  placeholder={t('botConfig.conversationFlow.addStepPlaceholder')}
                  className="flex-1"
                />
                <Button onClick={handleAddFlowStep} disabled={!newFlowStep.trim()} className="shrink-0">
                  <PlusCircle size={18} className="mr-2" />
                  {t('botConfig.conversationFlow.addStepButton')}
                </Button>
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
