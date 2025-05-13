
"use client";

import { useState } from 'react';
import type { SalesExecutive } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { PlusCircle, Users, Edit3, Trash2, Search, ArrowLeft } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useRouter } from 'next/navigation';

// Mock Data
const initialSalesExecutives: SalesExecutive[] = [
  { id: 'se1', name: 'John Doe', email: 'john.doe@example.com', phone: '555-1234' },
  { id: 'se2', name: 'Jane Smith', email: 'jane.smith@example.com', phone: '555-5678' },
  { id: 'se3', name: 'Carlos Ray', email: 'carlos.ray@example.com', phone: '555-8765' },
];

export default function SalesExecutivesPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [executives, setExecutives] = useState<SalesExecutive[]>(initialSalesExecutives);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentExecutive, setCurrentExecutive] = useState<SalesExecutive | null>(null);
  const [formData, setFormData] = useState<{ name: string; email?: string; phone?: string }>({ name: '', email: '', phone: '' });

  const filteredExecutives = executives.filter(exec => 
    exec.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (exec.email && exec.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenForm = (executive?: SalesExecutive) => {
    if (executive) {
      setCurrentExecutive(executive);
      setFormData({ name: executive.name, email: executive.email || '', phone: executive.phone || '' });
    } else {
      setCurrentExecutive(null);
      setFormData({ name: '', email: '', phone: '' });
    }
    setIsFormOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      // Basic validation, toast can be added here
      alert(t('adminSalesExecutives.validation.nameRequired'));
      return;
    }
    if (currentExecutive) {
      // Edit existing executive
      setExecutives(prev => prev.map(exec => 
        exec.id === currentExecutive.id ? { ...exec, ...formData } : exec
      ));
    } else {
      // Add new executive
      const newExecutive: SalesExecutive = {
        id: `se${Date.now()}`,
        ...formData,
      };
      setExecutives(prev => [newExecutive, ...prev]);
    }
    setIsFormOpen(false);
  };

  const handleDelete = (executiveId: string) => {
    // Confirmation dialog would be good here in a real app
    setExecutives(prev => prev.filter(exec => exec.id !== executiveId));
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <Button variant="outline" onClick={() => router.push('/')} className="mb-6">
          <ArrowLeft size={18} className="mr-2" />
          {t('adminSalesExecutives.backToChat')}
        </Button>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary flex items-center">
              <Users size={32} className="mr-3" /> 
              {t('adminSalesExecutives.title')}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t('adminSalesExecutives.description')}
            </p>
          </div>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenForm()} className="mt-2 sm:mt-0">
                <PlusCircle size={18} className="mr-2" /> 
                {t('adminSalesExecutives.addNew')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{currentExecutive ? t('adminSalesExecutives.editTitle') : t('adminSalesExecutives.addTitle')}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">{t('adminSalesExecutives.form.nameLabel')}</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleInputChange} className="col-span-3" placeholder={t('adminSalesExecutives.form.namePlaceholder')} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">{t('adminSalesExecutives.form.emailLabel')}</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} className="col-span-3" placeholder={t('adminSalesExecutives.form.emailPlaceholder')} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">{t('adminSalesExecutives.form.phoneLabel')}</Label>
                  <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} className="col-span-3" placeholder={t('adminSalesExecutives.form.phonePlaceholder')} />
                </div>
                <DialogFooter className="mt-4">
                  <DialogClose asChild>
                    <Button type="button" variant="outline">{t('adminSalesExecutives.form.cancel')}</Button>
                  </DialogClose>
                  <Button type="submit">{currentExecutive ? t('adminSalesExecutives.form.saveChanges') : t('adminSalesExecutives.form.addExecutive')}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>{t('adminSalesExecutives.listTitle')}</CardTitle>
          <CardDescription>{t('adminSalesExecutives.listDescription')}</CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder={t('adminSalesExecutives.searchPlaceholder')}
              className="pl-10 bg-input focus:bg-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredExecutives.length > 0 ? (
            <ul className="space-y-4">
              {filteredExecutives.map(exec => (
                <li key={exec.id} className="p-4 border rounded-lg bg-muted/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h3 className="font-semibold text-lg">{exec.name}</h3>
                    {exec.email && <p className="text-sm text-muted-foreground">{exec.email}</p>}
                    {exec.phone && <p className="text-sm text-muted-foreground">{exec.phone}</p>}
                  </div>
                  <div className="flex gap-2 mt-2 sm:mt-0 shrink-0">
                    <Button variant="outline" size="sm" onClick={() => handleOpenForm(exec)}>
                      <Edit3 size={16} className="mr-1 sm:mr-2" /> <span className="hidden sm:inline">{t('adminSalesExecutives.editButton')}</span>
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(exec.id)}>
                      <Trash2 size={16} className="mr-1 sm:mr-2" /> <span className="hidden sm:inline">{t('adminSalesExecutives.deleteButton')}</span>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-muted-foreground py-8">{t('adminSalesExecutives.noExecutivesFound')}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
