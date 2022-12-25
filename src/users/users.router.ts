import { Router } from 'express';
import { checkSchema } from 'express-validator';
import { postUserSchema, putPasswordSchema, putUsernameSchema } from './users.schema.js';
import { postUser, putPassword, putUsername } from './users.controller.js';
import { validate } from './users.validator.js';

const usersRouter = Router();

usersRouter.post('/', checkSchema(postUserSchema, ['body']), validate, postUser);

usersRouter.put('/password', checkSchema(putPasswordSchema, ['body']), validate, putPassword);

usersRouter.put('/username', checkSchema(putUsernameSchema, ['body']), validate, putUsername);

export { usersRouter };
