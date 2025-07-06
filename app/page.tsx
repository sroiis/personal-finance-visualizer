'use client';

import { useState } from 'react';

import TransactionList from '@/components/TransactionList';
import AddTransactionButton from '@/components/AddTransactionButton';
import ChartToggle from '@/components/ChartToggle';
import CategoryPieChart from '@/components/CategoryPieChart';
import SummaryCards from '@/components/SummaryCards';
import SetBudgetButton from '@/components/SetBudgetButton';

export default function Home() {
  const [reload, setReload] = useState(false);
  const [showMonthlyOnly, setShowMonthlyOnly] = useState(true);
  const [showMonthlyBreakdown, setShowMonthlyBreakdown] = useState(false);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white p-4 border-b flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold text-gray-800">Personal Finance Visualizer</h1>
        <div className="flex gap-2">
          <SetBudgetButton />
          <AddTransactionButton onAdd={() => setReload(!reload)} />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="px-6 mt-4">
        <SummaryCards reload={reload} showMonthlyBreakdown={showMonthlyBreakdown} />
      </div>

      {/* Spending Breakdown Section Heading */}
      <div className="px-6 mt-6 mb-2">
        <h2 className="text-lg font-semibold text-gray-800">Spending Breakdown</h2>
      </div>

      {/* View Monthly Totals Button + Toggle */}
      <div className="px-6 mb-4 flex justify-between items-center">
        <button
          className="text-sm px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 transition"
          onClick={() => setShowMonthlyBreakdown(!showMonthlyBreakdown)}
        >
          {showMonthlyBreakdown ? 'Hide Monthly Totals' : 'View Monthly Totals'}
        </button>

        <ChartToggle
          showMonthlyOnly={showMonthlyOnly}
          setShowMonthlyOnly={setShowMonthlyOnly}
        />
      </div>

      {/* Pie Chart */}
      <div className="px-6">
        <CategoryPieChart reload={reload} monthlyOnly={showMonthlyOnly} />
      </div>

      {/* Transaction List */}
      <div className="mt-6 px-6">
        <TransactionList reload={reload} />
      </div>
    </main>
  );
}
