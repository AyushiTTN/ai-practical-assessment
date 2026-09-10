import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useChatContext } from '../context/ChatContext';
import {
  addComment,
  getTicket,
  getUsers,
  updateTicket,
  updateTicketStatus,
} from '../api/tickets';
import { PriorityBadge, StatusBadge } from '../components/Badges';
import CommentForm from '../components/CommentForm';
import CommentList from '../components/CommentList';
import ErrorAlert from '../components/ErrorAlert';
import StatusTransitionButtons from '../components/StatusTransitionButtons';
import TicketForm from '../components/TicketForm';
import type { Status, Ticket, User } from '../types';

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { setPageContext, clearPageContext } = useChatContext();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const [t, u] = await Promise.all([getTicket(id), getUsers()]);
      setTicket(t);
      setUsers(u);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (ticket) {
      setPageContext({
        ticketId: ticket.id,
        ticketStatus: ticket.status,
        lastError: statusError,
      });
    }

    return () => {
      clearPageContext();
    };
  }, [ticket, statusError, setPageContext, clearPageContext]);

  async function handleStatusTransition(status: Status) {
    if (!id) return;
    setStatusError(null);
    setStatusLoading(true);
    try {
      const updated = await updateTicketStatus(id, status);
      setTicket(updated);
    } catch (err) {
      setStatusError((err as Error).message);
    } finally {
      setStatusLoading(false);
    }
  }

  if (loading) return <p className="text-gray-500">Loading ticket...</p>;
  if (error) return <ErrorAlert message={error} />;
  if (!ticket) return <p>Ticket not found.</p>;

  return (
    <div>
      <Link to="/" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
        &larr; Back to list
      </Link>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">{ticket.title}</h1>
          <div className="flex gap-2 mt-2">
            <PriorityBadge priority={ticket.priority} />
            <StatusBadge status={ticket.status} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="font-semibold mb-4">Edit Ticket</h2>
          <TicketForm
            users={users}
            initial={{
              title: ticket.title,
              description: ticket.description,
              priority: ticket.priority,
              assignedToId: ticket.assignedToId,
            }}
            submitLabel="Update Ticket"
            onSubmit={async (data) => {
              const updated = await updateTicket(ticket.id, data);
              setTicket(updated);
            }}
          />
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="font-semibold mb-2">Status</h2>
            <p className="text-sm text-gray-500 mb-3">
              Created by {ticket.createdBy.name} on {new Date(ticket.createdAt).toLocaleString()}
            </p>
            {statusError && (
              <ErrorAlert message={statusError} onDismiss={() => setStatusError(null)} />
            )}
            <StatusTransitionButtons
              currentStatus={ticket.status}
              onTransition={handleStatusTransition}
              loading={statusLoading}
            />
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="font-semibold mb-4">Comments</h2>
            <CommentList comments={ticket.comments ?? []} />
            <CommentForm
              users={users}
              onSubmit={async (data) => {
                await addComment(ticket.id, data);
                await load();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
