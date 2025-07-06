'use client';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { categories } from '@/lib/constants/categories';
import { useEffect, useState } from 'react';

export default function SetBudgetButton() {
  const [open, setOpen] = useState(false);
  const [budgets, setBudgets] = useState<Record<string, string>>({});

  useEffect(() => {
    const stored = localStorage.getItem('budgets');
    if (stored) setBudgets(JSON.parse(stored));
  }, []);

  const handleChange = (cat: string, value: string) => {
    setBudgets((prev) => ({ ...prev, [cat]: value }));
  };

  const handleSave = () => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Set Budget</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Set Category Budgets</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {categories.map((cat) => (
            <div key={cat.value} className="flex items-center justify-between gap-4">
              <Label className="w-1/2">{cat.label}</Label>
              <Input
                type="number"
                placeholder="0"
                value={budgets[cat.value] || ''}
                onChange={(e) => handleChange(cat.value, e.target.value)}
              />
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button onClick={handleSave}>Save Budgets</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
