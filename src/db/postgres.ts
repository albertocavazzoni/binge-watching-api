import pg from 'pg';
import env from '../config/env.js';

const options: pg.PoolConfig = {
    host: env.PG_HOST,
    port: env.PG_PORT,
    user: env.PG_USER,
    password: env.PG_PASSWORD,
    database: env.PG_DATABASE,
    statement_timeout: 50000, // number of milliseconds before a statement in query will time out, default is no timeout
    query_timeout: 50000, // number of milliseconds before a query call will timeout, default is no timeout
    application_name: 'binge-watching',
    connectionTimeoutMillis: 90000, // number of milliseconds to wait for connection, default is no timeout
    max: 10, // maximum number of clients the pool should contain
};

const pool = new pg.Pool(options);

pool.on('error', (err, client) => {
    console.error('POOL ERROR.', err, 'CLIENT:', client);
});

// pool.on('connect', client => {
//     console.log('POOL CONNECTED:', client);
// });

// pool.on('acquire', client => {
//     console.log('POOL ACQUIRED CLIENT:', client);
// });

export { pool };
