
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
import { Bot, Settings, Link2, CalendarClock, ListOrdered, PlusCircle, Trash2, Edit3, FileText, MessageSquare } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BotFlowStep } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";


interface BotConfigSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  flowSteps: BotFlowStep[];
  onFlowStepsChange: (steps: BotFlowStep[]) => void;
}

const initialNewStepData = { name: '', description: '', prompt: '' };

export function BotConfigSheet({ isOpen, onOpenChange, flowSteps, onFlowStepsChange }: BotConfigSheetProps) {
  const { t } = useTranslation();
  const [newStepData, setNewStepData] = useState(initialNewStepData);
  const [editingStep, setEditingStep] = useState<BotFlowStep | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editingStep) {
      setEditingStep(prev => prev ? { ...prev, [name]: value } : null);
    } else {
      setNewStepData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveStep = () => {
    if (editingStep) {
      if (!editingStep.name.trim()) {
        alert(t('botConfig.conversationFlow.validation.nameRequired')); // Simple alert, use toast in real app
        return;
      }
      onFlowStepsChange(flowSteps.map(step => step.id === editingStep.id ? editingStep : step));
      setEditingStep(null);
    } else {
      if (!newStepData.name.trim()) {
        alert(t('botConfig.conversationFlow.validation.nameRequired'));
        return;
      }
      if (flowSteps.some(step => step.name.toLowerCase() === newStepData.name.trim().toLowerCase())) {
         alert(t('botConfig.conversationFlow.validation.nameUnique'));
        return;
      }
      const newId = `${newStepData.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
      onFlowStepsChange([...flowSteps, { ...newStepData, id: newId }]);
      setNewStepData(initialNewStepData);
    }
  };

  const handleRemoveFlowStep = (stepIdToRemove: string) => {
    onFlowStepsChange(flowSteps.filter(step => step.id !== stepIdToRemove));
    if (editingStep && editingStep.id === stepIdToRemove) {
      setEditingStep(null); 
      setNewStepData(initialNewStepData);
    }
  };
  
  const handleEditStep = (step: BotFlowStep) => {
    setEditingStep(step);
    // setNewStepData is not needed here as we are editing, not creating a new one from scratch
  };

  const handleCancelEdit = () => {
    setEditingStep(null);
    setNewStepData(initialNewStepData); // Reset form for new step entry
  };

  const getStepDisplayName = (stepName: string) => {
    const translationKey = `botConfig.conversationFlow.stepDisplay.${stepName.toLowerCase().replace(/\s+/g, '_')}`;
    return t(translationKey, {}, stepName);
  };

  const currentFormData = editingStep || newStepData;
  const formTitle = editingStep 
    ? t('botConfig.conversationFlow.editStepTitle') 
    : t('botConfig.conversationFlow.addStepTitle');

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { onOpenChange(open); if (!open) handleCancelEdit(); }}>
      <SheetContent className="w-full sm:max-w-2xl flex flex-col p-0">
        <SheetHeader className="p-6 border-b">
          <SheetTitle className="flex items-center text-2xl">
            <Bot size={28} className="mr-3 text-primary" />
            {t('botConfig.title')}
          </SheetTitle>
          <SheetDescription className="mt-1">
            {t('botConfig.description')}
          </SheetDescription>
        </SheetHeader>
        
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
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
                   <p className="text-xs text-muted-foreground mt-1">{t('botConfig.botPersonaHelpText')}</p>
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
              <div className="p-4 border rounded-lg bg-card">
                <p className="text-sm text-muted-foreground mb-4">
                  {t('botConfig.conversationFlow.description')}
                </p>
                
                {/* Form for adding/editing a flow step */}
                <div className="space-y-4 p-4 mb-6 border rounded-lg bg-muted/20">
                  <h4 className="text-md font-semibold">{formTitle}</h4>
                  <div>
                    <Label htmlFor="step-name">{t('botConfig.conversationFlow.stepNameLabel')}</Label>
                    <Input 
                      id="step-name" 
                      name="name"
                      value={currentFormData.name} 
                      onChange={handleInputChange} 
                      placeholder={t('botConfig.conversationFlow.stepNamePlaceholder')} 
                      className="mt-1" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="step-description">{t('botConfig.conversationFlow.stepDescriptionLabel')}</Label>
                    <Textarea 
                      id="step-description" 
                      name="description"
                      value={currentFormData.description} 
                      onChange={handleInputChange} 
                      placeholder={t('botConfig.conversationFlow.stepDescriptionPlaceholder')} 
                      className="mt-1 min-h-[80px]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="step-prompt">{t('botConfig.conversationFlow.stepPromptLabel')}</Label>
                    <Textarea 
                      id="step-prompt" 
                      name="prompt"
                      value={currentFormData.prompt} 
                      onChange={handleInputChange} 
                      placeholder={t('botConfig.conversationFlow.stepPromptPlaceholder')} 
                      className="mt-1 min-h-[120px]"
                    />
                     <p className="text-xs text-muted-foreground mt-1">{t('botConfig.conversationFlow.stepPromptHelpText')}</p>
                  </div>
                  <div className="flex gap-2 justify-end">
                    {editingStep && (
                      <Button variant="outline" onClick={handleCancelEdit}>
                        {t('botConfig.conversationFlow.cancelEditButton')}
                      </Button>
                    )}
                    <Button onClick={handleSaveStep} disabled={!currentFormData.name.trim()} className="bg-primary hover:bg-primary/90">
                      <PlusCircle size={18} className="mr-2" />
                      {editingStep ? t('botConfig.conversationFlow.saveStepButton') : t('botConfig.conversationFlow.addStepButton')}
                    </Button>
                  </div>
                </div>

                {/* List of existing flow steps */}
                <div className="space-y-2">
                  {flowSteps.map((step, index) => (
                    <div key={step.id} className="flex items-start justify-between p-3 border rounded-md bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="flex-1 min-w-0 overflow-hidden"> {/* Added overflow-hidden here */}
                        <h5 className="font-semibold text-sm flex items-center">
                           <MessageSquare size={16} className="mr-2 text-primary opacity-80"/> {index + 1}. {getStepDisplayName(step.name)}
                        </h5>
                        <p className="text-xs text-muted-foreground mt-1 ml-1 break-words">{step.description}</p>
                        <p className="text-xs text-muted-foreground/70 mt-1 ml-1 italic break-words truncate" title={step.prompt}>
                          <span className="font-medium">Prompt hint:</span> {step.prompt.substring(0,100)}{step.prompt.length > 100 ? '...' : ''}
                        </p>
                      </div>
                      <div className="flex gap-1 shrink-0 ml-2 mt-0.5">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEditStep(step)} 
                          aria-label={t('botConfig.conversationFlow.editStepButton')}
                          className="h-7 w-7"
                        >
                          <Edit3 size={14} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleRemoveFlowStep(step.id)} 
                          aria-label={t('botConfig.conversationFlow.removeStepButton')}
                          className="h-7 w-7"
                        >
                          <Trash2 size={14} className="text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {flowSteps.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-4">
                      {t('botConfig.conversationFlow.emptyFlow')}
                    </p>
                  )}
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
        </ScrollArea>

        <SheetFooter className="p-6 border-t mt-auto">
          <SheetClose asChild>
            <Button variant="outline" onClick={handleCancelEdit}>{t('botConfig.cancel')}</Button>
          </SheetClose>
          <Button type="submit" className="bg-primary hover:bg-primary/90">
            {t('botConfig.saveConfiguration')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

