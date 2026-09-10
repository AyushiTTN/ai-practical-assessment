import cors from 'cors';
import express, { Express } from 'express';
import { errorHandler } from './middleware/errorHandler.js';
import { chatRoutes } from './routes/chat.js';
import { commentRoutes } from './routes/comments.js';
import { ticketRoutes } from './routes/tickets.js';
import { userRoutes } from './routes/users.js';

export function createApp(): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/tickets', ticketRoutes);
  app.use('/api/tickets', commentRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/chat', chatRoutes);

  app.use(errorHandler);

  return app;
}
