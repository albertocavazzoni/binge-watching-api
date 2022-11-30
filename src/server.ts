import express from 'express';
import { usersRouter } from './users/users.router.js';
import { mongoConnect } from './config/mongo.js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const PORT = 8000;

const app = express();

app.get('/', (_req, res) => {
    res.send('Express TS');
});

app.use('/users', usersRouter);

app.listen(PORT, async () => {
    await mongoConnect();
    console.log('App listening on port', PORT);
});
