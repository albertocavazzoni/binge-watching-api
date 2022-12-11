import { Router } from 'express';
import { getMe } from './users.controller.js';

const usersRouter = Router();

usersRouter.get('/me', getMe);

export { usersRouter };
