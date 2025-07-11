'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useEffect, useState } from 'react';
import { format, subMonths } from 'date-fns';

interface Transaction {
  amount: number;
  date: string;
  type: 'income' | 'expense';
}

export default function MonthlyBarChart({ reload }: { reload: boolean }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchTx = async () => {
      const res = await fetch('/api/transactions');
      const txs: Transaction[] = await res.json();

      const monthlyBudget = 20000;

      // Step 1: Create a map of past 6 months (or any range you want)
      const monthsMap: Record<string, { spent: number }> = {};
      for (let i = 0; i < 6; i++) {
        const month = format(subMonths(new Date(), i), 'MMM yy');
        monthsMap[month] = { spent: 0 };
      }

      // Step 2: Loop through transactions & accumulate expenses only
      txs.forEach((tx) => {
        const month = format(new Date(tx.date), 'MMM yy');
        if (tx.type === 'expense') {
          if (!monthsMap[month]) monthsMap[month] = { spent: 0 };
          monthsMap[month].spent += tx.amount;
        }
      });

      // Step 3: Convert to array in correct order (oldest to newest)
      const final = Object.entries(monthsMap)
        .reverse()
        .map(([month, { spent }]) => ({
          month,
          spent,
          budget: monthlyBudget,
        }));

      setData(final);
    };

    fetchTx();
  }, [reload]);

  return (
    <div className="h-80 w-full bg-white rounded-md shadow p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="spent" fill="#f87171" name="Spent" />
          <Bar dataKey="budget" fill="#60a5fa" name="Budget" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
