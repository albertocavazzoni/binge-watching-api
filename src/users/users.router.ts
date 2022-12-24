import { Router } from 'express';
import { postUser } from './users.controller.js';
import { validateRegisterUser, checkPasswords, validate } from './users.validator.js';

const usersRouter = Router();

usersRouter.post('/', validateRegisterUser(), checkPasswords, validate, postUser);

export { usersRouter };
