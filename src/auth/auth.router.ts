import { Router } from 'express';
import { login } from './auth.controller.js';

const authRouter = Router();

authRouter.post('/login', login);

export { authRouter };
