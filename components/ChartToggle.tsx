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
        className={`px-4 py-2 rounded ${showMonthlyOnly ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
      >
        This Month
      </button>
      <button
        onClick={() => setShowMonthlyOnly(false)}
        className={`px-4 py-2 rounded ${!showMonthlyOnly ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
      >
        All Time
      </button>
    </div>
  );
}
