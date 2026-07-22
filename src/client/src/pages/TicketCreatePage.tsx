import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTicket, getUsers } from '../api/tickets';
import TicketForm from '../components/TicketForm';
import type { User } from '../types';

export default function TicketCreatePage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    getUsers().then(setUsers).catch(console.error);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Create Ticket</h1>
      <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-2xl">
        <TicketForm
          users={users}
          showCreatedBy
          submitLabel="Create Ticket"
          onSubmit={async (data) => {
            const ticket = await createTicket({
              title: data.title,
              description: data.description,
              priority: data.priority,
              createdById: data.createdById!,
              assignedToId: data.assignedToId,
            });
            navigate(`/tickets/${ticket.id}`);
          }}
        />
      </div>
    </div>
  );
}
