'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useEffect, useState } from 'react';

export default function MonthlyBarChart({ reload }: { reload: boolean }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchTx = async () => {
      const res = await fetch('/api/transactions');
      const txs = await res.json();

      const grouped: Record<string, number> = {};

      txs.forEach((tx: any) => {
        const month = new Date(tx.date).toLocaleString('default', { month: 'short', year: '2-digit' });
        grouped[month] = (grouped[month] || 0) + tx.amount;
      });

      const monthlyBudget = 20000; 

      const final = Object.entries(grouped).map(([month, value]) => ({
        month,
        spent: value,
        budget: monthlyBudget,
      }));

      setData(final);
    };

    fetchTx();
  }, [reload]);

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="spent" fill="#60a5fa" name="Spent" />
          <Bar dataKey="budget" fill="#34d399" name="Budget" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
