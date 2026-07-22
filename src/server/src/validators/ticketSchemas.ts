import { z } from 'zod';

export const PriorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH']);
export const StatusEnum = z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'CANCELLED']);

export const createTicketSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  priority: PriorityEnum,
  createdById: z.string().min(1, 'Created by is required'),
  assignedToId: z.string().optional().nullable(),
});

export const updateTicketSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  priority: PriorityEnum.optional(),
  assignedToId: z.string().nullable().optional(),
});

export const updateStatusSchema = z.object({
  status: StatusEnum,
});

export const createCommentSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  createdById: z.string().min(1, 'Created by is required'),
});

export const listTicketsQuerySchema = z.object({
  search: z.string().optional(),
  status: StatusEnum.optional(),
});
