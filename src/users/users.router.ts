import { Router } from 'express';
import { getMe, postUser } from './users.controller.js';

const usersRouter = Router();

usersRouter.get('/me', getMe);

usersRouter.post('/', postUser);

export { usersRouter };
