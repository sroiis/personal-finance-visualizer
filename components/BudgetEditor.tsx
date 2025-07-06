'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { categories } from '@/lib/constants/categories';
import { initialBudgets } from '@/lib/constants/budgets';

export default function BudgetEditor({
  budgets,
  setBudgets,
}: {
  budgets: Record<string, number>;
  setBudgets: (b: Record<string, number>) => void;
}) {
  const [local, setLocal] = useState(budgets);

  const handleChange = (category: string, value: string) => {
    setLocal({ ...local, [category]: Number(value) });
  };

  const handleSave = () => {
    setBudgets(local);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="ml-auto block">Set Budgets</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-auto">
        <h2 className="text-lg font-semibold mb-4">Edit Category Budgets</h2>
        <div className="space-y-4">
          {categories.map((cat) => (
            <div key={cat.value} className="space-y-1">
              <Label>{cat.label}</Label>
              <Input
                type="number"
                value={local[cat.value] ?? 0}
                onChange={(e) => handleChange(cat.value, e.target.value)}
              />
            </div>
          ))}
          <Button className="mt-4 w-full" onClick={handleSave}>
            Save Budgets
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
