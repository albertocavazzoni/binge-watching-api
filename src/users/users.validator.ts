import { Request, Response, NextFunction } from 'express';
import { check, validationResult, ValidationChain } from 'express-validator';
import { PoolClient } from 'pg';

function validateRegisterUser(): ValidationChain[] {
    return [
        check('email')
            .isLength({ min: 5, max: 30 })
            .withMessage('Email must be at least 5 chars and max 30 chars')
            .bail()
            .isEmail()
            .withMessage('Email is not valid')
            .normalizeEmail()
            .bail(),
        check('username')
            .isLength({ min: 5, max: 30 })
            .withMessage('Username must be at least 5 chars and max 30 chars')
            .bail()
            .matches(/^[A-Za-z\d_]+[A-Z-a-z-_\d_\-.]+(?![\/]+)[A-Za-z\d_]$/gm)
            .withMessage('Username is not valid')
            .bail(),
        check('password')
            .isLength({ min: 8, max: 30 })
            .withMessage('Password must be at least 8 chars and max 30 chars')
            .bail()
            .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[.!?_\-])[0-9a-zA-Z!?_\-.]{8,}$/gm)
            .withMessage(
                'Password must contain at least an uppercase and lowercase char, a number and a special char',
            )
            .bail(),
    ];
}

function checkPasswords(req: Request, res: Response, next: NextFunction) {
    if (req.body.confirmPassword !== req.body.password) {
        return res.status(400).send({
            status: 'error',
            error: {
                msg: 'Password and confirm password do not match',
                param: 'password',
                location: 'body',
            },
        });
    }

    return next();
}

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

export { validateRegisterUser, checkPasswords, checkExistingUser, validate };
