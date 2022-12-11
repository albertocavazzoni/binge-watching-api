import { pool } from '../db/postgres.js';
import { UserDB } from './users.interface.js';

async function getUserByUsername(username: string): Promise<UserDB | null> {
    const client = await pool.connect();
    try {
        const query = 'SELECT * FROM public.user WHERE username = $1::text';
        const values = [username];
        const result = await client.query(query, values);
        return result.rows[0] ?? null;
    } catch (err) {
        console.error(err);
        return null;
    }
}

export { getUserByUsername };
