'use client';

import { useState, useEffect } from 'react';

import TransactionList from '@/components/TransactionList';
import AddTransactionButton from '@/components/AddTransactionButton';
import ChartToggle from '@/components/ChartToggle';
import CategoryPieChart from '@/components/CategoryPieChart';
import SummaryCards from '@/components/SummaryCards';
import SetBudgetButton from '@/components/SetBudgetButton';
import MonthlyBarChart from '@/components/MonthlyBarChart';

export default function Home() {
  const [reload, setReload] = useState(false);
  const [showMonthlyOnly, setShowMonthlyOnly] = useState(true);
//const [loggedIn, setLoggedIn] = useState(false);

  
  return (
    <main className="min-h-screen bg-opacity-100 bg-brown-50 text-gray-800">
      <div className="sticky top-0 bg-cream bg-opacity-100 p-4 border-b flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold text-gray-800">Personal Finance Visualizer</h1>
        <div className="flex gap-2">
          <SetBudgetButton onSave={() => setReload(prev => !prev)} />
          <AddTransactionButton onAdd={() => setReload(prev => !prev)} />
        </div>
      </div>

      <div className="px-6 mt-4">
        <SummaryCards reload={reload} />
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
