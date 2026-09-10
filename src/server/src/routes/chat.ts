import { Router } from 'express';
import type { Status } from '../lib/db.js';
import { generateChatReply } from '../services/chatService.js';
import { getDefaultSuggestions, getWelcomeMessage } from '../services/helpKnowledge.js';
import { chatRequestSchema } from '../validators/chatSchemas.js';

export const chatRoutes = Router();

chatRoutes.post('/', async (req, res, next) => {
  try {
    const { message, context } = chatRequestSchema.parse(req.body);
    const response = generateChatReply(message, context);
    res.json(response);
  } catch (err) {
    next(err);
  }
});

chatRoutes.get('/welcome', async (req, res, next) => {
  try {
    const route = typeof req.query.route === 'string' ? req.query.route : undefined;
    const ticketStatus =
      typeof req.query.ticketStatus === 'string' ? (req.query.ticketStatus as Status) : undefined;

    res.json({
      reply: getWelcomeMessage(route),
      suggestions: getDefaultSuggestions(route, ticketStatus),
    });
  } catch (err) {
    next(err);
  }
});
