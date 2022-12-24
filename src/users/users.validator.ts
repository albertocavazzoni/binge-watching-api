import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { PoolClient } from 'pg';

async function checkExistingUser(client: PoolClient, username: string, email: string) {
    const searchQuery =
        'SELECT username, email FROM public.user WHERE LOWER(username) = $1::text OR LOWER(email) = $2::text';
    const searchValues = [username.toLowerCase(), email.toLowerCase()];
    const searchResult = await client.query(searchQuery, searchValues);
    if (searchResult.rowCount) {
        const param =
            username.toLowerCase() === searchResult.rows[0].username.toLowerCase()
                ? 'username'
                : 'email';
        const value = param === 'username' ? username : email;
        return {
            status: 'error',
            error: { value, param, msg: `Field ${param} already exists` },
        };
    }

    return { status: 'OK' };
}

function validate(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }

    return res.status(422).send({ status: 'error', error: errors.array()[0] });
}

export { checkExistingUser, validate };
