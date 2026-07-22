import { useEffect, useState } from 'react';
import type { Priority, User } from '../types';
import ErrorAlert from './ErrorAlert';

interface TicketFormProps {
  users: User[];
  initial?: {
    title: string;
    description: string;
    priority: Priority;
    createdById?: string;
    assignedToId?: string | null;
  };
  onSubmit: (data: {
    title: string;
    description: string;
    priority: Priority;
    createdById?: string;
    assignedToId?: string | null;
  }) => Promise<void>;
  submitLabel?: string;
  showCreatedBy?: boolean;
}

export default function TicketForm({
  users,
  initial,
  onSubmit,
  submitLabel = 'Save',
  showCreatedBy = false,
}: TicketFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? 'MEDIUM');
  const [createdById, setCreatedById] = useState(initial?.createdById ?? users[0]?.id ?? '');
  const [assignedToId, setAssignedToId] = useState(initial?.assignedToId ?? '');
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<{ field: string; message: string }[]>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initial) {
      setTitle(initial.title);
      setDescription(initial.description);
      setPriority(initial.priority);
      setAssignedToId(initial.assignedToId ?? '');
    }
  }, [initial]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setDetails(undefined);
    setLoading(true);
    try {
      await onSubmit({
        title,
        description,
        priority,
        ...(showCreatedBy ? { createdById } : {}),
        assignedToId: assignedToId || null,
      });
    } catch (err) {
      const e = err as Error & { details?: { field: string; message: string }[] };
      setError(e.message);
      setDetails(e.details);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <ErrorAlert message={error} details={details} onDismiss={() => setError(null)} />}
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Assignee</label>
          <select
            value={assignedToId}
            onChange={(e) => setAssignedToId(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="">Unassigned</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
      </div>
      {showCreatedBy && (
        <div>
          <label className="block text-sm font-medium mb-1">Created By</label>
          <select
            value={createdById}
            onChange={(e) => setCreatedById(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
      >
        {loading ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
