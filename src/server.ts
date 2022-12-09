import express from 'express';
import 'dotenv/config';
import { usersRouter } from './users/users.router.js';
import { pool } from './db/postgres.js';

const PORT = 8000;

const app = express();

app.get('/', (_req, res) => {
    res.send('Express TS');
});

app.use('/users', usersRouter);

app.listen(PORT, async () => {
    const client = await pool.connect();
    try {
        const res = await client.query('SELECT * FROM public.user');
        console.log(res.rows);
    } catch (error) {
        console.error(error);
    } finally {
        client.release();
    }
});
