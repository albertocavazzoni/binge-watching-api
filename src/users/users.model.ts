import bcrypt from 'bcrypt';
import { pool } from '../db/pooling.js';
import { executeQuery, parseError } from '../db/functions.js';
import { UserDB, UserIn } from './users.interface.js';

async function getUserByUsername(username: string): Promise<UserDB | null> {
    const query = 'SELECT * FROM public.user WHERE username = $1::text';
    const values = [username];
    const rows = await executeQuery(query, values);
    return rows[0] ?? undefined;
}

async function registerUser(params: UserIn) {
    if (params.password !== params.confirmPassword) {
        return {
            status: 'error',
            message: 'Password and confirm password do not match',
            statusCode: 400,
        };
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

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
                message: `Can not insert user`,
                statusCode: 422,
            };
        }
    } catch (err: Error | unknown) {
        await client.query('ROLLBACK');

        const parsedError = parseError(err);
        if (
            parsedError &&
            parsedError.routine === '_bt_check_unique' &&
            typeof parsedError.constraint === 'string'
        ) {
            const uniqueParam = parsedError.constraint.split('_')[1];
            return {
                status: 'error',
                message: `Inserted ${uniqueParam} already exists`,
                statusCode: 409,
            };
        }

        throw err;
    } finally {
        client.release();
    }
}

export { getUserByUsername, registerUser };
