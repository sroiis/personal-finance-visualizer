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
      try {
        const res = await fetch('/api/transactions');
        const txs: unknown = await res.json();

        if (!Array.isArray(txs)) {
          console.error('Expected array, got:', txs);
          return;
        }

        const monthlyBudget = 20000;

        const monthsMap: Record<string, { spent: number }> = {};
        for (let i = 0; i < 6; i++) {
          const month = format(subMonths(new Date(), i), 'MMM yy');
          monthsMap[month] = { spent: 0 };
        }

        txs.forEach((tx) => {
          const month = format(new Date(tx.date), 'MMM yy');
          if (tx.type === 'expense') {
            if (!monthsMap[month]) monthsMap[month] = { spent: 0 };
            monthsMap[month].spent += tx.amount;
          }
        });

        const final = Object.entries(monthsMap)
          .reverse()
          .map(([month, { spent }]) => ({
            month,
            spent,
            budget: monthlyBudget,
          }));

        setData(final);
      } catch (err) {
        console.error('Error fetching bar chart data:', err);
      }
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
