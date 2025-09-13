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
import { format } from 'date-fns';

interface Props {
  onSave?: () => void; // callback to trigger chart reload
}

export default function SetBudgetButton({ onSave }: Props) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [budgets, setBudgets] = useState<Record<string, string>>({});

  // fetch budgets for selected month
  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const res = await fetch(`/api/budgets?month=${month}`, {
          credentials: 'include',
        });
        if (!res.ok) return;
        const data = await res.json();
        const formatted = Object.fromEntries(
          data.map((b: any) => [b.category, b.amount])
        );
        setBudgets(formatted);
      } catch (err) {
        console.error('Failed to fetch budgets:', err);
      }
    };
    fetchBudgets();
  }, [month]);

  const handleChange = (cat: string, value: string) => {
    setBudgets(prev => ({ ...prev, [cat]: value }));
  };

  const handleSave = async () => {
    try {
      const payload = Object.entries(budgets).map(([category, amount]) => ({
        category,
        amount: Math.max(0, Number(amount) || 0), // prevent negative
        month, // store as "YYYY-MM"
      }));

      if (payload.length === 0) return;

      await fetch('/api/budgets', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      setOpen(false);
      if (onSave) onSave(); // trigger chart reload
    } catch (err) {
      console.error('Failed to save budgets:', err);
    }
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

        <div className="mb-4 flex flex-col gap-1">
          <Label>Month</Label>
          <Input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
        </div>

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
