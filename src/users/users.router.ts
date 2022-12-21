import { Router } from 'express';
import { getMe, postUser } from './users.controller.js';
import { validateRegisterUser, validate } from './users.validator.js';

const usersRouter = Router();

usersRouter.get('/me', getMe);

usersRouter.post('/', validateRegisterUser(), validate, postUser);

export { usersRouter };
