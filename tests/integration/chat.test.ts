import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/server/src/app.js';

const app = createApp();

describe('Chat API Integration Tests', () => {
  it('returns status transition help for OPEN', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({
        message: 'What can I do next?',
        context: { route: '/tickets/abc', ticketId: 'abc', ticketStatus: 'OPEN' },
      });

    expect(res.status).toBe(200);
    expect(res.body.reply).toContain('In Progress');
    expect(res.body.reply).toContain('Cancelled');
    expect(res.body.suggestions).toBeInstanceOf(Array);
  });

  it('explains create ticket flow', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ message: 'How do I create a ticket?', context: { route: '/' } });

    expect(res.status).toBe(200);
    expect(res.body.reply).toContain('New Ticket');
    expect(res.body.reply).toContain('title');
  });

  it('explains search and filter', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ message: 'How do I search tickets?', context: { route: '/' } });

    expect(res.status).toBe(200);
    expect(res.body.reply).toContain('search');
    expect(res.body.reply).toContain('status');
  });

  it('explains invalid transition using lastError context', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({
        message: 'Why did that fail?',
        context: {
          route: '/tickets/abc',
          ticketStatus: 'OPEN',
          lastError: 'Invalid status transition from OPEN to CLOSED',
        },
      });

    expect(res.status).toBe(200);
    expect(res.body.reply).toContain('Invalid status transition');
    expect(res.body.reply).toContain('In Progress');
  });

  it('returns terminal status guidance for CLOSED', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({
        message: 'What status can I change to?',
        context: { route: '/tickets/abc', ticketStatus: 'CLOSED' },
      });

    expect(res.status).toBe(200);
    expect(res.body.reply).toContain('terminal');
  });

  it('returns fallback for unknown questions', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ message: 'xyzzy unknown topic', context: { route: '/' } });

    expect(res.status).toBe(200);
    expect(res.body.reply).toContain('I can help you with');
    expect(res.body.suggestions.length).toBeGreaterThan(0);
  });

  it('validates empty message', async () => {
    const res = await request(app).post('/api/chat').send({ message: '' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });

  it('returns welcome message with suggestions', async () => {
    const res = await request(app).get('/api/chat/welcome').query({ route: '/tickets/new' });

    expect(res.status).toBe(200);
    expect(res.body.reply).toContain('creating a ticket');
    expect(res.body.suggestions).toContain('What fields are required?');
  });
});
