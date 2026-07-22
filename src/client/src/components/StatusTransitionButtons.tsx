import type { Status } from '../types';
import { formatStatus, getAllowedTransitions } from '../utils/status';

interface StatusTransitionButtonsProps {
  currentStatus: Status;
  onTransition: (status: Status) => Promise<void>;
  loading?: boolean;
}

export default function StatusTransitionButtons({
  currentStatus,
  onTransition,
  loading,
}: StatusTransitionButtonsProps) {
  const allowed = getAllowedTransitions(currentStatus);

  if (allowed.length === 0) {
    return <p className="text-sm text-gray-500">No further status transitions available.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {allowed.map((status) => (
        <button
          key={status}
          disabled={loading}
          onClick={() => onTransition(status)}
          className="border border-gray-300 bg-white px-3 py-1.5 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50"
        >
          Move to {formatStatus(status)}
        </button>
      ))}
    </div>
  );
}
