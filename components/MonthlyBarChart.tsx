'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useEffect, useState } from 'react';
import { format, subMonths } from 'date-fns';

interface Transaction {
  amount: number;
  date: string;
  type: 'income' | 'expense';
}

interface Budget {
  category: string;
  month: string;
  amount: number;
}

interface MonthlyData {
  month: string;
  spent: number;
  budget: number;
}

interface Props {
  reload: boolean; // toggle to refetch
}

export default function MonthlyBarChart({ reload }: Props) {
  const [data, setData] = useState<MonthlyData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resTx = await fetch('/api/transactions', { cache: 'no-store' });
        const txs: Transaction[] = await resTx.json();

        const monthsMap: Record<string, { spent: number; budget: number }> = {};
        for (let i = 5; i >= 0; i--) {
          const key = format(subMonths(new Date(), i), 'yyyy-MM');
          monthsMap[key] = { spent: 0, budget: 0 };
        }

        // Sum expenses per month
        txs.forEach(tx => {
          if (tx.type === 'expense') {
            const key = format(new Date(tx.date), 'yyyy-MM');
            if (!monthsMap[key]) monthsMap[key] = { spent: 0, budget: 0 };
            monthsMap[key].spent += Number(tx.amount) || 0;
          }
        });

        // Fetch budgets for each month
        const budgetPromises = Object.keys(monthsMap).map(async key => {
         // Fetch budgets
const resBud = await fetch(`/api/budgets?month=${key}`);
let budgets: Budget[] = [];
if (resBud.ok) budgets = await resBud.json();

// Build a map so each category is counted only once (latest value)
const budgetMap: Record<string, number> = {};
budgets.forEach(b => {
  budgetMap[b.category] = b.amount; // replaces old value if exists
});

// Sum all category budgets to get total for the month
monthsMap[key].budget = Object.values(budgetMap).reduce((sum, val) => sum + val, 0);

        });

        await Promise.all(budgetPromises);

        const finalData: MonthlyData[] = Object.entries(monthsMap).map(([month, { spent, budget }]) => ({
          month: format(new Date(month + '-01'), 'MMM yy'),
          spent,
          budget,
        }));

        setData(finalData);
      } catch (err) {
        console.error('Error fetching bar chart data:', err);
      }
    };

    fetchData();
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
