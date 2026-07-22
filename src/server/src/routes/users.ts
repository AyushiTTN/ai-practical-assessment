import { Router } from 'express';
import * as userRepo from '../repositories/userRepository.js';

export const userRoutes = Router();

userRoutes.get('/', async (_req, res, next) => {
  try {
    const users = userRepo.getAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
});
