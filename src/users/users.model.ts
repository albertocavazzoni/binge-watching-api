import bcrypt from 'bcrypt';
import { pool } from '../db/pooling.js';
import { executeQuery } from '../db/functions.js';
import { UserDB, UserIn } from './users.interface.js';

async function getUserByUsername(username: string): Promise<UserDB | undefined> {
    const query = 'SELECT * FROM public.user WHERE username = $1::text';
    const values = [username];
    const rows = await executeQuery(query, values);
    return rows[0] ?? undefined;
}

async function registerUser(params: UserIn) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Search for username / email duplicate
        const searchQuery =
            'SELECT username, email FROM public.user WHERE LOWER(username) = $1::text OR LOWER(email) = $2::text';
        const searchValues = [params.username.toLowerCase(), params.email.toLowerCase()];
        const searchResult = await client.query(searchQuery, searchValues);
        if (searchResult.rowCount) {
            const duplicateParam =
                params.username.toLowerCase() === searchResult.rows[0].username.toLowerCase()
                    ? 'username'
                    : 'email';
            return {
                status: 'error',
                error: {
                    value: params[duplicateParam],
                    param: duplicateParam,
                    msg: `Field ${duplicateParam} ${params[duplicateParam]} already exists`,
                },
                statusCode: 409,
            };
        }

        const hash = await bcrypt.hash(params.password, 5);
        const query =
            'INSERT INTO public.user (username, email, password) VALUES($1::text, $2::text, $3::text)';
        const values = [params.username, params.email, hash];
        const result = await client.query(query, values);

        if (result.rowCount) {
            await client.query('COMMIT');
            const user: UserDB = result.rows[0];
            return { status: 'OK', data: { user }, statusCode: 201 };
        } else {
            return {
                status: 'error',
                error: {
                    msg: `Can not insert user`,
                },
                statusCode: 422,
            };
        }
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

export { getUserByUsername, registerUser };
