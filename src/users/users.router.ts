import { Router } from 'express';
import { checkSchema } from 'express-validator';
import { postUser, putPassword } from './users.controller.js';
import { validate } from './users.validator.js';
import { postUserSchema, putPasswordSchema } from './users.schema.js';

const usersRouter = Router();

usersRouter.post('/', checkSchema(postUserSchema, ['body']), validate, postUser);

usersRouter.put('/password', checkSchema(putPasswordSchema, ['body']), validate, putPassword);

export { usersRouter };
