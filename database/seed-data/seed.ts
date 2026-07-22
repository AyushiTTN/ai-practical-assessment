import { getDb } from '../../src/server/src/lib/db.js';
import * as userRepo from '../../src/server/src/repositories/userRepository.js';
import * as ticketRepo from '../../src/server/src/repositories/ticketRepository.js';

getDb();

userRepo.deleteAllUsers();

const alice = userRepo.createUser({ name: 'Alice Agent', email: 'alice@support.local', role: 'AGENT' });
const bob = userRepo.createUser({ name: 'Bob Agent', email: 'bob@support.local', role: 'AGENT' });
const carol = userRepo.createUser({ name: 'Carol Admin', email: 'carol@support.local', role: 'ADMIN' });

const ticket1 = ticketRepo.createTicket({
  title: 'Login page not loading',
  description: 'Users report blank screen on login page after latest deploy.',
  priority: 'HIGH',
  createdById: alice.id,
  assignedToId: bob.id,
});

const ticket2 = ticketRepo.createTicket({
  title: 'Password reset email delayed',
  description: 'Reset emails take over 30 minutes to arrive.',
  priority: 'MEDIUM',
  createdById: carol.id,
  assignedToId: alice.id,
});
ticketRepo.updateTicketStatus(ticket2.id, 'IN_PROGRESS');

const ticket3 = ticketRepo.createTicket({
  title: 'Export CSV feature request',
  description: 'Customer wants to export ticket history as CSV.',
  priority: 'LOW',
  createdById: bob.id,
  assignedToId: alice.id,
});
ticketRepo.updateTicketStatus(ticket3.id, 'RESOLVED');

const ticket4 = ticketRepo.createTicket({
  title: 'Duplicate notifications',
  description: 'Users receive two emails for each ticket update.',
  priority: 'MEDIUM',
  createdById: alice.id,
  assignedToId: bob.id,
});
ticketRepo.updateTicketStatus(ticket4.id, 'RESOLVED');
ticketRepo.updateTicketStatus(ticket4.id, 'CLOSED');

const ticket5 = ticketRepo.createTicket({
  title: 'Mobile layout broken',
  description: 'Ticket list overflows on small screens.',
  priority: 'HIGH',
  createdById: carol.id,
});
ticketRepo.updateTicketStatus(ticket5.id, 'CANCELLED');

ticketRepo.createComment({ ticketId: ticket1.id, message: 'Investigating CDN cache issue.', createdById: bob.id });
ticketRepo.createComment({ ticketId: ticket2.id, message: 'Queued for email provider review.', createdById: alice.id });
ticketRepo.createComment({ ticketId: ticket3.id, message: 'CSV export implemented in staging.', createdById: alice.id });

console.log('Seed data created successfully.');
