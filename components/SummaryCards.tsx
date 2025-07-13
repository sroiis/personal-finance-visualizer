'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { categories } from '@/lib/constants/categories';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface Transaction {
  _id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'income' | 'expense';
}

export default function SummaryCards({ reload }: { reload: boolean }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlySpending, setMonthlySpending] = useState(0);
  const [topCategory, setTopCategory] = useState<string | null>(null);
  const [recent, setRecent] = useState<Transaction[]>([]);
  const [showMonthlyBreakdown, setShowMonthlyBreakdown] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/transactions');
        const data: unknown = await res.json();

        if (!Array.isArray(data)) {
          console.error('Expected array, got:', data);
          return;
        }

        setTransactions(data);

        const now = new Date();
        const thisMonth = data.filter((tx) => {
          const txDate = new Date(tx.date);
          return (
            txDate.getMonth() === now.getMonth() &&
            txDate.getFullYear() === now.getFullYear()
          );
        });

        const income = thisMonth
          .filter((tx) => tx.type === 'income')
          .reduce((sum, tx) => sum + tx.amount, 0);

        const spending = thisMonth
          .filter((tx) => tx.type === 'expense')
          .reduce((sum, tx) => sum + tx.amount, 0);

        setMonthlyIncome(income);
        setMonthlySpending(spending);

        const byCategory: Record<string, number> = {};
        thisMonth
          .filter((tx) => tx.type === 'expense')
          .forEach((tx) => {
            byCategory[tx.category] = (byCategory[tx.category] || 0) + tx.amount;
          });

        const top = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];
        setTopCategory(top?.[0] || null);

        const recentTx = [...thisMonth]
          .sort((a, b) => +new Date(b.date) - +new Date(a.date))
          .slice(0, 3);
        setRecent(recentTx);
      } catch (err) {
        console.error('Error fetching summary:', err);
      }
    };

    fetchData();
  }, [reload]);

  const getLabel = (value: string) =>
    categories.find((c) => c.value === value)?.label || value;

  return (
    <div className="p-4 rounded-md shadow-md">
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        <Card className="bg-white shadow flex-1 border-green-400 border-l-4">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Income (This Month)</p>
            <p className="text-2xl font-semibold text-green-600 mt-2">₹{monthlyIncome}</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow flex-1 border-red-400 border-l-4">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Spent (This Month)</p>
            <p className="text-2xl font-semibold text-red-600 mt-2">₹{monthlySpending}</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow flex-1">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Top Category</p>
            <p className="text-xl font-medium text-foreground mt-2">
              {topCategory ? getLabel(topCategory) : '—'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow flex-1">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-2">Recent Transactions</p>
            <ul className="space-y-1 text-sm">
              {recent.map((tx) => (
                <li key={tx._id} className="flex justify-between">
                  <span>{tx.description || 'No description'}</span>
                  <span
                    className={`font-medium ${
                      tx.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    ₹{tx.amount}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="col-span-3 mt-2 text-center">
        <Button
          variant="outline"
          onClick={() => setShowMonthlyBreakdown(!showMonthlyBreakdown)}
        >
          {showMonthlyBreakdown ? 'Hide Monthly Breakdown' : 'View Monthly Breakdown'}
        </Button>

        {showMonthlyBreakdown && (
          <div className="mt-4 text-sm text-left bg-gold p-4 rounded-md shadow">
            <h3 className="font-semibold mb-2 text-lg">Monthly Breakdown</h3>
            {Object.entries(
              transactions.reduce<
                Record<string, { income: number; expense: number }>
              >((acc, tx) => {
                const month = format(new Date(tx.date), 'MMMM yyyy');
                if (!acc[month]) acc[month] = { income: 0, expense: 0 };
                if (tx.type === 'income') acc[month].income += tx.amount;
                else acc[month].expense += tx.amount;
                return acc;
              }, {})
            ).map(([month, { income, expense }]) => (
              <div key={month} className="mb-4">
                <p className="text-base font-semibold text-gray-800 mb-1">{month}</p>
                <div className="flex justify-between px-2">
                  <span className="text-green-600">Income:</span>
                  <span className="text-green-600 font-medium">₹{income}</span>
                </div>
                <div className="flex justify-between px-2">
                  <span className="text-red-600">Spent:</span>
                  <span className="text-red-600 font-medium">₹{expense}</span>
                </div>
                <div className="flex justify-between px-2">
                  <span className="text-blue-600">Net Savings:</span>
                  <span className="text-blue-600 font-medium">₹{income - expense}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
