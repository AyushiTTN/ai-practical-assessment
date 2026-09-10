import { z } from 'zod';
import { StatusEnum } from './ticketSchemas.js';

export const chatContextSchema = z
  .object({
    route: z.string().optional(),
    ticketId: z.string().optional(),
    ticketStatus: StatusEnum.optional(),
    lastError: z.string().nullable().optional(),
  })
  .optional();

export const chatRequestSchema = z.object({
  message: z.string().min(1, 'Message is required').max(500, 'Message is too long'),
  context: chatContextSchema,
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;
