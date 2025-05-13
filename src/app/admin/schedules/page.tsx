
"use client";

import { useState, useMemo, useEffect } from 'react';
import type { SalesExecutive, AvailabilitySlot } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, CalendarDays, Clock, PlusCircle, Edit3, Trash2 } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useRouter } from 'next/navigation';
import { format, parseISO, addDays, setHours, setMinutes, startOfDay } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

// Mock Data for Sales Executives
const mockSalesExecutives: SalesExecutive[] = [
  { id: 'se1', name: 'John Doe', email: 'john.doe@example.com' },
  { id: 'se2', name: 'Jane Smith', email: 'jane.smith@example.com' },
  { id: 'se3', name: 'Carlos Ray', email: 'carlos.ray@example.com' },
];

// Mock Data for Availability Slots
const initialAvailabilitySlots: AvailabilitySlot[] = [
  { id: 'slot1', executiveId: 'se1', startTime: setHours(setMinutes(startOfDay(new Date()), 0), 9), endTime: setHours(setMinutes(startOfDay(new Date()), 0), 10), isBooked: false },
  { id: 'slot2', executiveId: 'se1', startTime: setHours(setMinutes(startOfDay(new Date()), 0), 10), endTime: setHours(setMinutes(startOfDay(new Date()), 0), 11), isBooked: true, bookedByContactId: 'contact1', appointmentNotes: 'Discuss Q3 strategy' },
  { id: 'slot3', executiveId: 'se2', startTime: setHours(setMinutes(startOfDay(addDays(new Date(),1)), 30), 14), endTime: setHours(setMinutes(startOfDay(addDays(new Date(),1)), 30), 15), isBooked: false },
];


export default function SchedulesPage() {
  const { t, dateLocale } = useTranslation();
  const router = useRouter();
  const [executives] = useState<SalesExecutive[]>(mockSalesExecutives);
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>(initialAvailabilitySlots);
  const [selectedExecutiveId, setSelectedExecutiveId] = useState<string | null>(executives.length > 0 ? executives[0].id : null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const [isSlotFormOpen, setIsSlotFormOpen] = useState(false);
  const [currentSlot, setCurrentSlot] = useState<AvailabilitySlot | null>(null);
  const [slotFormData, setSlotFormData] = useState<{startTime: string; endTime: string; notes?: string}>({startTime: '', endTime: '', notes: ''});


  const slotsForSelectedDateAndExecutive = useMemo(() => {
    if (!selectedDate || !selectedExecutiveId) return [];
    return availabilitySlots
      .filter(slot => 
        slot.executiveId === selectedExecutiveId &&
        format(slot.startTime, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
      )
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  }, [availabilitySlots, selectedDate, selectedExecutiveId]);

  const selectedExecutive = useMemo(() => {
    return executives.find(exec => exec.id === selectedExecutiveId);
  }, [selectedExecutiveId, executives]);

  useEffect(() => {
    // Pre-fill form with defaults when opening for a new slot
    if (isSlotFormOpen && !currentSlot && selectedDate) {
      const defaultStartTime = setHours(setMinutes(selectedDate,0),9);
      const defaultEndTime = setHours(setMinutes(selectedDate,0),10);
      setSlotFormData({
        startTime: format(defaultStartTime, "HH:mm"),
        endTime: format(defaultEndTime, "HH:mm"),
        notes: ''
      });
    }
  }, [isSlotFormOpen, currentSlot, selectedDate]);

  const handleOpenSlotForm = (slot?: AvailabilitySlot) => {
    if (slot) {
      setCurrentSlot(slot);
      setSlotFormData({
        startTime: format(slot.startTime, "HH:mm"),
        endTime: format(slot.endTime, "HH:mm"),
        notes: slot.appointmentNotes || ''
      });
    } else {
      setCurrentSlot(null);
      // Default times will be set by useEffect if selectedDate is available
      if (selectedDate) {
        const defaultStartTime = setHours(setMinutes(selectedDate,0),9);
        const defaultEndTime = setHours(setMinutes(selectedDate,0),10);
        setSlotFormData({startTime: format(defaultStartTime, "HH:mm"), endTime: format(defaultEndTime, "HH:mm"), notes: ''});
      } else {
        setSlotFormData({startTime: '09:00', endTime: '10:00', notes: ''});
      }
    }
    setIsSlotFormOpen(true);
  };

  const handleSlotInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSlotFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSlotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExecutiveId || !selectedDate || !slotFormData.startTime || !slotFormData.endTime) {
      alert(t('adminSchedules.validation.slotFormError'));
      return;
    }

    const [startHour, startMinute] = slotFormData.startTime.split(':').map(Number);
    const [endHour, endMinute] = slotFormData.endTime.split(':').map(Number);

    const newStartTime = setHours(setMinutes(startOfDay(selectedDate), startMinute), startHour);
    const newEndTime = setHours(setMinutes(startOfDay(selectedDate), endMinute), endHour);

    if (newEndTime <= newStartTime) {
      alert(t('adminSchedules.validation.endTimeAfterStartTime'));
      return;
    }

    if (currentSlot) { // Editing existing slot
      setAvailabilitySlots(prevSlots => prevSlots.map(s => 
        s.id === currentSlot.id 
        ? { ...s, startTime: newStartTime, endTime: newEndTime, appointmentNotes: slotFormData.notes } 
        : s
      ));
    } else { // Adding new slot
      const newSlot: AvailabilitySlot = {
        id: `slot${Date.now()}`,
        executiveId: selectedExecutiveId,
        startTime: newStartTime,
        endTime: newEndTime,
        isBooked: false,
        appointmentNotes: slotFormData.notes
      };
      setAvailabilitySlots(prevSlots => [...prevSlots, newSlot]);
    }
    setIsSlotFormOpen(false);
  };

  const handleDeleteSlot = (slotId: string) => {
    // Confirmation dialog would be good here
    setAvailabilitySlots(prevSlots => prevSlots.filter(s => s.id !== slotId));
  };


  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <Button variant="outline" onClick={() => router.push('/')} className="mb-6">
          <ArrowLeft size={18} className="mr-2" />
          {t('adminSchedules.backToChat')}
        </Button>
        <h1 className="text-3xl font-bold text-primary flex items-center">
          <CalendarDays size={32} className="mr-3" /> 
          {t('adminSchedules.title')}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t('adminSchedules.description')}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Calendar and Executive Selector */}
        <div className="md:col-span-1 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>{t('adminSchedules.selectExecutive')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedExecutiveId || undefined} onValueChange={(value) => setSelectedExecutiveId(value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('adminSchedules.selectExecutivePlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {executives.map(exec => (
                    <SelectItem key={exec.id} value={exec.id}>{exec.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>{t('adminSchedules.selectDate')}</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                locale={dateLocale}
              />
            </CardContent>
          </Card>
        </div>

        {/* Availability Slots Display */}
        <div className="md:col-span-2">
          <Card className="shadow-xl h-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>
                    {t('adminSchedules.availabilityFor')} {selectedExecutive ? selectedExecutive.name : t('adminSchedules.noExecutiveSelected')}
                  </CardTitle>
                  <CardDescription>
                    {selectedDate ? format(selectedDate, 'PPPP', { locale: dateLocale }) : t('adminSchedules.noDateSelected')}
                  </CardDescription>
                </div>
                {selectedExecutiveId && selectedDate && (
                  <Button onClick={() => handleOpenSlotForm()}>
                    <PlusCircle size={18} className="mr-2" />
                    {t('adminSchedules.addSlot')}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {slotsForSelectedDateAndExecutive.length > 0 ? (
                <ul className="space-y-3">
                  {slotsForSelectedDateAndExecutive.map(slot => (
                    <li key={slot.id} className={`p-3 border rounded-lg ${slot.isBooked ? 'bg-destructive/10 border-destructive/30' : 'bg-muted/20'}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold flex items-center">
                            <Clock size={16} className="mr-2 opacity-70" />
                            {format(slot.startTime, 'p', { locale: dateLocale })} - {format(slot.endTime, 'p', { locale: dateLocale })}
                          </p>
                          {slot.isBooked ? (
                            <p className="text-sm text-destructive font-medium">{t('adminSchedules.booked')}</p>
                          ) : (
                            <p className="text-sm text-green-600">{t('adminSchedules.available')}</p>
                          )}
                          {slot.isBooked && slot.appointmentNotes && (
                             <p className="text-xs text-muted-foreground mt-1">Notes: {slot.appointmentNotes}</p>
                          )}
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleOpenSlotForm(slot)}>
                            <Edit3 size={14} /> <span className="sr-only">{t('adminSchedules.editSlot')}</span>
                          </Button>
                          <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDeleteSlot(slot.id)}>
                            <Trash2 size={14} /> <span className="sr-only">{t('adminSchedules.deleteSlot')}</span>
                          </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  {selectedExecutiveId && selectedDate ? t('adminSchedules.noSlotsForDate') : t('adminSchedules.selectExecutiveAndDatePrompt')}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog for Adding/Editing Slot */}
      <Dialog open={isSlotFormOpen} onOpenChange={setIsSlotFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{currentSlot ? t('adminSchedules.editSlotTitle') : t('adminSchedules.addSlotTitle')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSlotSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startTime" className="text-right">{t('adminSchedules.form.startTimeLabel')}</Label>
              <Input id="startTime" name="startTime" type="time" value={slotFormData.startTime} onChange={handleSlotInputChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endTime" className="text-right">{t('adminSchedules.form.endTimeLabel')}</Label>
              <Input id="endTime" name="endTime" type="time" value={slotFormData.endTime} onChange={handleSlotInputChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">{t('adminSchedules.form.notesLabel')}</Label>
              <Input id="notes" name="notes" value={slotFormData.notes || ''} onChange={handleSlotInputChange} className="col-span-3" placeholder={t('adminSchedules.form.notesPlaceholder')} />
            </div>
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">{t('adminSchedules.form.cancel')}</Button>
              </DialogClose>
              <Button type="submit">{currentSlot ? t('adminSchedules.form.saveChanges') : t('adminSchedules.form.addSlotButton')}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}

