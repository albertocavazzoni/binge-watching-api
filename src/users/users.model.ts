import bcrypt from 'bcrypt';
import { pool } from '../db/pooling.js';
import { executeQuery } from '../db/functions.js';
import { UserDB, UserIn } from './users.interface.js';
import { checkExistingUser } from './users.validator.js';

async function getUserByUsername(username: string): Promise<UserDB | undefined> {
    const query = 'SELECT * FROM public.user WHERE username = $1::text';
    const values = [username];
    const result = await executeQuery(query, values);
    return result.rows[0] ?? undefined;
}

async function registerUser(params: UserIn) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Search for username / email duplicate
        const existingUser = await checkExistingUser(client, params.username, params.password);
        if (existingUser.status === 'error') {
            return { ...existingUser, statusCode: 409 };
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

async function updatePassword(userId: number, newPassword: string) {
    const query = 'UPDATE public.user SET password = $1::text WHERE id = $2';
    const hash = await bcrypt.hash(newPassword, 5);
    const values = [hash, userId];
    const result = await executeQuery(query, values);
    if (result.rowCount) {
        return { status: 'OK', data: result.rowCount };
    } else {
        return { status: 'error', error: { msg: 'Erron on updating password' } };
    }
}

async function updateUsername(userId: number, username: string) {
    const query = 'UPDATE public.user SET username = $1::text WHERE id = $2';
    const values = [username, userId];
    const result = await executeQuery(query, values);
    if (result.rowCount) {
        return { status: 'OK', data: result.rowCount };
    } else {
        return { status: 'error', error: { msg: 'Erron on updating username' } };
    }
}

export { getUserByUsername, registerUser, updatePassword, updateUsername };
