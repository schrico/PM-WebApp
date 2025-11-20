import { LayoutGrid, Table } from 'lucide-react';

interface ViewToggleProps {
  view: 'table' | 'card';
  onViewChange: (view: 'table' | 'card') => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
      <button
        onClick={() => onViewChange('table')}
        className={`p-2 rounded-md transition-all ${
          view === 'table'
            ? 'bg-blue-500 text-white shadow-sm'
            : 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
        }`}
        title="Table view"
      >
        <Table className="w-4 h-4" />
      </button>
      <button
        onClick={() => onViewChange('card')}
        className={`p-2 rounded-md transition-all ${
          view === 'card'
            ? 'bg-blue-500 text-white shadow-sm'
            : 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
        }`}
        title="Card view"
      >
        <LayoutGrid className="w-4 h-4" />
      </button>
    </div>
  );
}
