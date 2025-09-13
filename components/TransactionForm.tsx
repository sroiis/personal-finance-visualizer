'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { categories } from '@/lib/constants/categories';

interface Props {
  onAdd: () => void;
}

export default function TransactionForm({ onAdd }: Props) {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');

  const filteredCategories = categories.filter((cat) => cat.type === type);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!amount || !category || !date) {
      setError('Please fill all required fields.');
      return;
    }

    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Number(amount),
          description: description.trim(),
          date,
          category,
          type,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err?.error || 'Something went wrong');
        return;
      }

      setAmount('');
      setDescription('');
      setCategory('');
      setType('expense');
      onAdd();
    } catch (err) {
      console.error('POST /api/transactions failed:', err);
      setError('Failed to add transaction. Please try again.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 border rounded-lg max-w-md mx-auto bg-white shadow-md"
    >
      <div className="space-y-1">
        <Label htmlFor="type">Type</Label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value as 'income' | 'expense')}
          className="w-full border rounded-md px-3 py-2"
          required
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>

      <div className="space-y-1">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0"
          required
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border rounded-md px-3 py-2"
          required
        >
          <option value="" disabled>
            Select a category
          </option>
          {filteredCategories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 font-medium">{error}</p>
      )}

      <Button type="submit" className="w-full">
        Add Transaction
      </Button>
    </form>
  );
}
