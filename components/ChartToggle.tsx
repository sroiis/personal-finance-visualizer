'use client';

interface ChartToggleProps {
  showMonthlyOnly: boolean;
  setShowMonthlyOnly: (value: boolean) => void;
}

export default function ChartToggle({ showMonthlyOnly, setShowMonthlyOnly }: ChartToggleProps) {
  return (
    <div className="flex justify-center gap-2">
      <button
        onClick={() => setShowMonthlyOnly(true)}
        className={`px-4 py-2 rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
          showMonthlyOnly ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
        aria-pressed={showMonthlyOnly}
      >
        This Month
      </button>
      <button
        onClick={() => setShowMonthlyOnly(false)}
        className={`px-4 py-2 rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
          !showMonthlyOnly ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
        aria-pressed={!showMonthlyOnly}
      >
        All Time
      </button>
    </div>
  );
}
