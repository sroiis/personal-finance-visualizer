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
}

export default function SummaryCards({ reload }: { reload: boolean }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [topCategory, setTopCategory] = useState<string | null>(null);
  const [recent, setRecent] = useState<Transaction[]>([]);
  const [showMonthlyBreakdown, setShowMonthlyBreakdown] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/transactions');
      const data: Transaction[] = await res.json();
      setTransactions(data);

      const now = new Date();
      const thisMonth = data.filter((tx) => {
        const txDate = new Date(tx.date);
        return (
          txDate.getMonth() === now.getMonth() &&
          txDate.getFullYear() === now.getFullYear()
        );
      });

      const totalSpent = thisMonth.reduce((sum, tx) => sum + tx.amount, 0);
      setMonthlyTotal(totalSpent);

      const byCategory: Record<string, number> = {};
      thisMonth.forEach((tx) => {
        byCategory[tx.category] = (byCategory[tx.category] || 0) + tx.amount;
      });

      const top = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];
      setTopCategory(top?.[0] || null);

      const recentTx = [...thisMonth].sort(
        (a, b) => +new Date(b.date) - +new Date(a.date)
      ).slice(0, 3);
      setRecent(recentTx);
    };

    fetchData();
  }, [reload]);

  const getLabel = (value: string) =>
    categories.find((c) => c.value === value)?.label || value;

  return (
    <div className="grid sm:grid-cols-3 gap-4 mb-6 px-4">
      {/* Total This Month */}
      <Card className="bg-white shadow">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Total Spent (This Month)</p>
          <p className="text-2xl font-semibold text-foreground mt-2">₹{monthlyTotal}</p>
        </CardContent>
      </Card>

      {/* Top Category */}
      <Card className="bg-white shadow">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Top Category</p>
          <p className="text-xl font-medium text-foreground mt-2">
            {topCategory ? getLabel(topCategory) : '—'}
          </p>
        </CardContent>
      </Card>

      {/* Most Recent */}
      <Card className="bg-white shadow">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground mb-2">Recent Transactions</p>
          <ul className="space-y-1 text-sm">
            {recent.map((tx) => (
              <li key={tx._id} className="flex justify-between">
                <span>{tx.description || 'No description'}</span>
                <span className="font-medium">₹{tx.amount}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Monthly Breakdown Button */}
      <div className="col-span-3 mt-2 text-center">
        <Button
          variant="outline"
          onClick={() => setShowMonthlyBreakdown(!showMonthlyBreakdown)}
        >
          {showMonthlyBreakdown ? 'Hide Monthly Totals' : 'View Monthly Totals'}
        </Button>

        {showMonthlyBreakdown && (
          <div className="mt-4 text-sm text-left bg-white p-4 rounded-md shadow">
            <h3 className="font-semibold mb-2">Monthly Totals</h3>
            {Object.entries(
              transactions.reduce<Record<string, number>>((acc, tx) => {
                const month = format(new Date(tx.date), 'MMMM yyyy');
                acc[month] = (acc[month] || 0) + tx.amount;
                return acc;
              }, {})
            ).map(([month, total]) => (
              <div key={month} className="flex justify-between">
                <span>{month}</span>
                <span className="font-medium">₹{total}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
