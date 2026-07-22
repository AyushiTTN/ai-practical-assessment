import { Router } from 'express';
import { AppError } from '../utils/errors.js';
import {
  createTicketSchema,
  listTicketsQuerySchema,
  updateStatusSchema,
  updateTicketSchema,
} from '../validators/ticketSchemas.js';
import { canTransition } from '../services/stateMachine.js';
import type { Status } from '../lib/db.js';
import * as ticketRepo from '../repositories/ticketRepository.js';
import * as userRepo from '../repositories/userRepository.js';

export const ticketRoutes = Router();

ticketRoutes.get('/', async (req, res, next) => {
  try {
    const { search, status } = listTicketsQuerySchema.parse(req.query);
    const tickets = ticketRepo.findAllTickets({ search, status: status as Status | undefined });
    res.json(tickets);
  } catch (err) {
    next(err);
  }
});

ticketRoutes.post('/', async (req, res, next) => {
  try {
    const data = createTicketSchema.parse(req.body);

    const creator = userRepo.findUserById(data.createdById);
    if (!creator) throw new AppError(400, 'Created by user not found');

    if (data.assignedToId) {
      const assignee = userRepo.findUserById(data.assignedToId);
      if (!assignee) throw new AppError(400, 'Assigned to user not found');
    }

    const ticket = ticketRepo.createTicket(data);
    res.status(201).json(ticket);
  } catch (err) {
    next(err);
  }
});

ticketRoutes.get('/:id', async (req, res, next) => {
  try {
    const ticket = ticketRepo.findTicketById(req.params.id);
    if (!ticket) throw new AppError(404, 'Ticket not found');
    res.json(ticket);
  } catch (err) {
    next(err);
  }
});

ticketRoutes.patch('/:id', async (req, res, next) => {
  try {
    const data = updateTicketSchema.parse(req.body);
    const existing = ticketRepo.findTicketById(req.params.id);
    if (!existing) throw new AppError(404, 'Ticket not found');

    if (data.assignedToId) {
      const assignee = userRepo.findUserById(data.assignedToId);
      if (!assignee) throw new AppError(400, 'Assigned to user not found');
    }

    const ticket = ticketRepo.updateTicket(req.params.id, data);
    res.json(ticket);
  } catch (err) {
    next(err);
  }
});

ticketRoutes.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = updateStatusSchema.parse(req.body);
    const existing = ticketRepo.findTicketById(req.params.id);
    if (!existing) throw new AppError(404, 'Ticket not found');

    if (!canTransition(existing.status, status as Status)) {
      throw new AppError(409, `Invalid status transition from ${existing.status} to ${status}`);
    }

    const ticket = ticketRepo.updateTicketStatus(req.params.id, status as Status);
    res.json(ticket);
  } catch (err) {
    next(err);
  }
});
