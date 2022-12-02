import pg from 'pg';

const options: pg.PoolConfig = {
    host: process.env.PG_HOST,
    port: 5432,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
};

const pool = new pg.Pool(options);

async function test() {
    const results = await pool.query('SELECT * FROM public.user');
    console.log(results);
}

export { test };
