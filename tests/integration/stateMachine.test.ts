import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/server/src/app.js';
import * as userRepo from '../../src/server/src/repositories/userRepository.js';
import * as ticketRepo from '../../src/server/src/repositories/ticketRepository.js';
import { getDb } from '../../src/server/src/lib/db.js';

const app = createApp();

let userId: string;
let ticketId: string;

beforeEach(() => {
  getDb();
  userRepo.deleteAllUsers();

  const user = userRepo.createUser({
    name: 'Test User',
    email: `test-${Date.now()}@test.local`,
    role: 'AGENT',
  });
  userId = user.id;

  const ticket = ticketRepo.createTicket({
    title: 'Test ticket',
    description: 'Test description',
    priority: 'MEDIUM',
    createdById: userId,
  });
  ticketId = ticket.id;
});

afterEach(() => {
  userRepo.deleteAllUsers();
});

describe('State Machine Integration Tests', () => {
  it('OPEN -> IN_PROGRESS succeeds', async () => {
    const res = await request(app)
      .patch(`/api/tickets/${ticketId}/status`)
      .send({ status: 'IN_PROGRESS' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('IN_PROGRESS');
  });

  it('IN_PROGRESS -> RESOLVED succeeds', async () => {
    ticketRepo.updateTicketStatus(ticketId, 'IN_PROGRESS');

    const res = await request(app)
      .patch(`/api/tickets/${ticketId}/status`)
      .send({ status: 'RESOLVED' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('RESOLVED');
  });

  it('RESOLVED -> CLOSED succeeds', async () => {
    ticketRepo.updateTicketStatus(ticketId, 'RESOLVED');

    const res = await request(app)
      .patch(`/api/tickets/${ticketId}/status`)
      .send({ status: 'CLOSED' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('CLOSED');
  });

  it('OPEN -> CANCELLED succeeds', async () => {
    const res = await request(app)
      .patch(`/api/tickets/${ticketId}/status`)
      .send({ status: 'CANCELLED' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('CANCELLED');
  });

  it('IN_PROGRESS -> CANCELLED succeeds', async () => {
    ticketRepo.updateTicketStatus(ticketId, 'IN_PROGRESS');

    const res = await request(app)
      .patch(`/api/tickets/${ticketId}/status`)
      .send({ status: 'CANCELLED' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('CANCELLED');
  });

  it('OPEN -> CLOSED is rejected', async () => {
    const res = await request(app)
      .patch(`/api/tickets/${ticketId}/status`)
      .send({ status: 'CLOSED' });

    expect(res.status).toBe(409);
    expect(res.body.error).toContain('Invalid status transition');
  });

  it('OPEN -> RESOLVED is rejected', async () => {
    const res = await request(app)
      .patch(`/api/tickets/${ticketId}/status`)
      .send({ status: 'RESOLVED' });

    expect(res.status).toBe(409);
    expect(res.body.error).toContain('Invalid status transition');
  });

  it('RESOLVED -> IN_PROGRESS is rejected', async () => {
    ticketRepo.updateTicketStatus(ticketId, 'RESOLVED');

    const res = await request(app)
      .patch(`/api/tickets/${ticketId}/status`)
      .send({ status: 'IN_PROGRESS' });

    expect(res.status).toBe(409);
    expect(res.body.error).toContain('Invalid status transition');
  });

  it('CLOSED -> IN_PROGRESS is rejected', async () => {
    ticketRepo.updateTicketStatus(ticketId, 'RESOLVED');
    ticketRepo.updateTicketStatus(ticketId, 'CLOSED');

    const res = await request(app)
      .patch(`/api/tickets/${ticketId}/status`)
      .send({ status: 'IN_PROGRESS' });

    expect(res.status).toBe(409);
    expect(res.body.error).toContain('Invalid status transition');
  });

  it('CANCELLED -> OPEN is rejected', async () => {
    ticketRepo.updateTicketStatus(ticketId, 'CANCELLED');

    const res = await request(app)
      .patch(`/api/tickets/${ticketId}/status`)
      .send({ status: 'OPEN' });

    expect(res.status).toBe(409);
    expect(res.body.error).toContain('Invalid status transition');
  });
});

describe('Validation and Error Handling', () => {
  it('create ticket with missing title returns 400', async () => {
    const res = await request(app)
      .post('/api/tickets')
      .send({ description: 'No title', priority: 'LOW', createdById: userId });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });

  it('comment on non-existent ticket returns 404', async () => {
    const res = await request(app)
      .post('/api/tickets/nonexistent-id/comments')
      .send({ message: 'Hello', createdById: userId });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Ticket not found');
  });
});
