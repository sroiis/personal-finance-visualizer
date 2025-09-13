'use client';

import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { categoryColors } from '@/lib/constants/categoryColors';

interface Transaction {
  _id: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
}

interface Props {
  reload: boolean;
  monthlyOnly: boolean;
}

export default function CategoryPieChart({ reload, monthlyOnly }: Props) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/transactions', {
          method: 'GET', 
          credentials: 'include',
        });
        const all: unknown = await res.json();

        if (!Array.isArray(all)) {
          console.error('Expected array, got:', all);
          setData([]); 
          return;
        }

        const now = new Date();
        const filtered = monthlyOnly
          ? all.filter((tx) => {
              const txDate = new Date(tx.date);
              return (
                tx.type === 'expense' &&
                txDate.getMonth() === now.getMonth() &&
                txDate.getFullYear() === now.getFullYear()
              );
            })
          : all.filter((tx) => tx.type === 'expense');

        const grouped: Record<string, number> = {};
        filtered.forEach((tx) => {
          grouped[tx.category] = (grouped[tx.category] || 0) + tx.amount;
        });

        const chartData = Object.entries(grouped).map(([category, total]) => ({
          name: category,
          value: total,
          color: categoryColors[category],
        }));

        setData(chartData);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setData([]);
      }
    };

    fetchData();
  }, [reload, monthlyOnly]);

  const fallbackColors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
    '#FF9F40', '#8e44ad', '#2ecc71', '#f1c40f', '#e74c3c',
  ];

  return (
    <div className="bg-white p-4 shadow rounded-md">
      <h2 className="text-lg font-semibold mb-2 text-center">
        {monthlyOnly ? "This Month’s Spending by Category" : "Total Spending by Category"}
      </h2>

      {data.length === 0 ? (
        <p className="text-center text-gray-500">No data available</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || fallbackColors[index % fallbackColors.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
