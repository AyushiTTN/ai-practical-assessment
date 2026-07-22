import { Router } from 'express';
import { AppError } from '../utils/errors.js';
import { createCommentSchema } from '../validators/ticketSchemas.js';
import * as ticketRepo from '../repositories/ticketRepository.js';
import * as userRepo from '../repositories/userRepository.js';

export const commentRoutes = Router();

commentRoutes.post('/:id/comments', async (req, res, next) => {
  try {
    const data = createCommentSchema.parse(req.body);

    const ticket = ticketRepo.findTicketById(req.params.id);
    if (!ticket) throw new AppError(404, 'Ticket not found');

    const author = userRepo.findUserById(data.createdById);
    if (!author) throw new AppError(400, 'Comment author not found');

    const comment = ticketRepo.createComment({
      ticketId: req.params.id,
      message: data.message,
      createdById: data.createdById,
    });

    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
});
