import express from 'express';
import 'dotenv/config';
import { usersRouter } from './users/users.router.js';
import { test } from './config/postgres.js';

const PORT = 8000;

const app = express();

app.get('/', (_req, res) => {
    res.send('Express TS');
});

app.use('/users', usersRouter);

app.listen(PORT, async () => {
    await test();
    console.log('App listening on port', PORT);
});
