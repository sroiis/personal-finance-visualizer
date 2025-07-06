'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { categories } from '@/lib/constants/categories';

export default function TransactionForm({ onAdd }: { onAdd: () => void }) {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [category, setCategory] = useState('Bills'); 

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !date || !category) return;

        const res = await fetch('/api/transactions', {
            method: 'POST',
            body: JSON.stringify({
                amount: Number(amount),
                description,
                date,
                category,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (res.ok) {
            setAmount('');
            setDescription('');
            setCategory('');
            onAdd();
        }
    };


    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 p-4 border rounded-lg max-w-md mx-auto bg-white shadow-md"
        >
            <div className="space-y-1">
                <Label htmlFor="amount" className="block">Amount</Label>
                <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                />
            </div>

            <div className="space-y-1">
                <Label htmlFor="category" className="block">Category</Label>
                <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border rounded-md px-3 py-2"
                    required
                >
                    {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                            {cat.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-y-1">
                <Label htmlFor="description" className="block">Description</Label>
                <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Optional"
                />
            </div>

            <div className="space-y-1">
                <Label htmlFor="date" className="block">Date</Label>
                <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
            </div>

            <Button type="submit" className="w-full">
                Add Transaction
            </Button>
        </form>
    );
}
