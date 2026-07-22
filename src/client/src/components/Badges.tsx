import type { Priority, Status } from '../types';

const priorityStyles: Record<Priority, string> = {
  LOW: 'bg-gray-100 text-gray-700',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-red-100 text-red-800',
};

const statusStyles: Record<Status, string> = {
  OPEN: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-purple-100 text-purple-800',
  RESOLVED: 'bg-green-100 text-green-800',
  CLOSED: 'bg-gray-100 text-gray-700',
  CANCELLED: 'bg-orange-100 text-orange-800',
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityStyles[priority]}`}>
      {priority}
    </span>
  );
}

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}
