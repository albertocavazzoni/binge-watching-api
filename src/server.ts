import express from 'express';
import 'dotenv/config';
import env from './config/env.js';
import { usersRouter } from './users/users.router.js';
import { authRouter } from './auth/auth.router.js';
import { isAuth } from './config/middlewares.js';

const app = express();

app.use(express.json());
app.use((_req, res, next) => {
    res.type('application/json');
    next();
});

app.all('*', isAuth);

app.get('/', (_req, res) => {
    res.send('Express TS');
});

app.use('/users', usersRouter);
app.use('/auth', authRouter);

app.listen(env.API_PORT, async () =>
    console.log('Server listen on port', env.API_PORT),
);

