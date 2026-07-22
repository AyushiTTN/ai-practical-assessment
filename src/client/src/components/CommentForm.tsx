import { useState } from 'react';
import type { User } from '../types';
import ErrorAlert from './ErrorAlert';

interface CommentFormProps {
  users: User[];
  onSubmit: (data: { message: string; createdById: string }) => Promise<void>;
}

export default function CommentForm({ users, onSubmit }: CommentFormProps) {
  const [message, setMessage] = useState('');
  const [createdById, setCreatedById] = useState(users[0]?.id ?? '');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onSubmit({ message, createdById });
      setMessage('');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mt-4">
      {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Add a comment..."
        required
        rows={3}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
      />
      <div className="flex items-center gap-3">
        <select
          value={createdById}
          onChange={(e) => setCreatedById(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
        >
          {users.map((u) => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
        <button
          type="submit"
          disabled={loading}
          className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 disabled:opacity-50 text-sm"
        >
          {loading ? 'Posting...' : 'Add Comment'}
        </button>
      </div>
    </form>
  );
}
