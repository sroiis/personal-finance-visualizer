'use client';

import { useEffect, useState } from 'react';
import { Trash2, Pencil, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { categories } from '@/lib/constants/categories';
import { categoryColors } from '@/lib/constants/categoryColors';

export default function TransactionList({ reload }: { reload: boolean }) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ amount: '', description: '', date: '', category: '' });
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/transactions');
      const data = await res.json();
      setTransactions(data);
    };
    fetchData();
  }, [reload, trigger]);

  const deleteTx = async (id: string) => {
    await fetch(`/api/transactions?id=${id}`, { method: 'DELETE' });
    setTrigger(!trigger);
  };

  const startEdit = (tx: any) => {
    setEditingId(tx._id);
    setForm({
      amount: tx.amount,
      description: tx.description || '',
      date: tx.date.slice(0, 10),
      category: tx.category,
    });
  };

  const submitEdit = async () => {
    await fetch(`/api/transactions?id=${editingId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        amount: Number(form.amount),
        description: form.description,
        date: form.date,
        category: form.category,
      }),
      headers: { 'Content-Type': 'application/json' },
    });
    setEditingId(null);
    setTrigger(!trigger);
  };

  const getCategoryLabel = (value: string) =>
    categories.find((c) => c.value === value)?.label || value;

  return (
    <div className="px-4 py-6 w-full">
      <h2 className="text-xl font-bold mb-4">Transactions</h2>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-sm border border-gray-200 rounded-md bg-white shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-right">Amount</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => {
              const colorClass = categoryColors[tx.category] || 'border-gray-300 text-gray-600';
              const categoryLabel = getCategoryLabel(tx.category);

              const isEditing = editingId === tx._id;

              return (
                <tr key={tx._id} className="border-t border-gray-200">
                  {isEditing ? (
                    <>
                      <td className="p-3">
                        <Input
                          type="date"
                          value={form.date}
                          onChange={(e) => setForm({ ...form, date: e.target.value })}
                        />
                      </td>
                      <td className="p-3">
                        <select
                          value={form.category}
                          onChange={(e) => setForm({ ...form, category: e.target.value })}
                          className="border rounded-md px-2 py-1"
                        >
                          {categories.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-3">
                        <Input
                          value={form.description}
                          onChange={(e) => setForm({ ...form, description: e.target.value })}
                          placeholder="Optional"
                        />
                      </td>
                      <td className="p-3">
                        <Input
                          type="number"
                          value={form.amount}
                          onChange={(e) => setForm({ ...form, amount: e.target.value })}
                        />
                      </td>
                      <td className="p-3 text-center flex gap-2 justify-center">
                        <Button onClick={submitEdit} size="sm">
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button onClick={() => setEditingId(null)} variant="outline" size="sm">
                          <X className="w-4 h-4" />
                        </Button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-3">{new Date(tx.date).toLocaleDateString()}</td>
                      <td className="p-3">
                        <Badge variant="outline" className={`text-xs ${colorClass}`}>
                          {categoryLabel}
                        </Badge>
                      </td>
                      <td className="p-3 text-gray-700">
                        {tx.description || <span className="text-gray-400 italic">(No description)</span>}
                      </td>
                      <td className="p-3 text-right font-semibold">₹{tx.amount}</td>
                      <td className="p-3 text-center flex gap-2 justify-center">
                        <Button variant="ghost" size="icon" onClick={() => startEdit(tx)}>
                          <Pencil className="w-4 h-4 text-blue-500" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteTx(tx._id)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
