import { STATUS_OPTIONS } from '../utils/status';
import type { Status } from '../types';

interface SearchFilterBarProps {
  search: string;
  status: Status | '';
  onSearchChange: (value: string) => void;
  onStatusChange: (value: Status | '') => void;
}

export default function SearchFilterBar({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: SearchFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <input
        type="text"
        placeholder="Search by keyword..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value as Status | '')}
        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
