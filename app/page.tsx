'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';

import TransactionList from '@/components/TransactionList';
import AddTransactionButton from '@/components/AddTransactionButton';
import ChartToggle from '@/components/ChartToggle';
import CategoryPieChart from '@/components/CategoryPieChart';
import SummaryCards from '@/components/SummaryCards';
import SetBudgetButton from '@/components/SetBudgetButton';
import MonthlyBarChart from '@/components/MonthlyBarChart';

interface Transaction {
  _id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export default function Home() {
  const [reload, setReload] = useState(false);
  const [showMonthlyOnly, setShowMonthlyOnly] = useState(true);
  const [showMonthlyBreakdown, setShowMonthlyBreakdown] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${window.location.origin}/api/transactions`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setTransactions(data);
        } else {
          console.error('Expected array, got:', data);
        }
      } catch (err) {
        console.error('Error fetching transactions:', err);
      }
    };

    fetchData();
  }, [reload]);

  return (
    <main className="min-h-screen bg-pink-50 text-gray-800">
      <div className="sticky top-0 z-50 bg-white p-4 border-b flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold text-gray-800">Personal Finance Visualizer</h1>
        <div className="flex gap-2">
          <SetBudgetButton />
          <AddTransactionButton onAdd={() => setReload(!reload)} />
        </div>
      </div>

      <div className="px-6 mt-4">
        <SummaryCards reload={reload} showMonthlyBreakdown={showMonthlyBreakdown} />
      </div>

      <div className="px-6 mt-8 flex justify-end mb-4">
        <ChartToggle
          showMonthlyOnly={showMonthlyOnly}
          setShowMonthlyOnly={setShowMonthlyOnly}
        />
      </div>


      <div className="px-6">
        <CategoryPieChart reload={reload} monthlyOnly={showMonthlyOnly} />
      </div>

      <div className="px-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Monthly Spending</h2>
        <MonthlyBarChart reload={reload} />
      </div>

      <div className="mt-6 px-6">
        <TransactionList reload={reload} />
      </div>
    </main>
  );
}
