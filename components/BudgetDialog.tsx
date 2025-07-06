'use client';

import { useEffect, useState } from 'react';
import { categories } from '@/lib/constants/categories';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function BudgetDialog() {
  const [budgets, setBudgets] = useState<Record<string, number>>({});

  useEffect(() => {
    const stored = localStorage.getItem('budgets');
    if (stored) setBudgets(JSON.parse(stored));
  }, []);

  const updateBudget = (category: string, value: string) => {
    const newBudgets = {
      ...budgets,
      [category]: Number(value),
    };
    setBudgets(newBudgets);
    localStorage.setItem('budgets', JSON.stringify(newBudgets));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Set Budgets</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-2">Set Monthly Budgets</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 max-h-[60vh] overflow-y-auto pr-2">
          {categories.map((cat) => (
            <div key={cat.value} className="space-y-1">
              <Label htmlFor={cat.value}>{cat.label}</Label>
              <Input
                id={cat.value}
                type="number"
                value={budgets[cat.value] || ''}
                onChange={(e) => updateBudget(cat.value, e.target.value)}
              />
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
