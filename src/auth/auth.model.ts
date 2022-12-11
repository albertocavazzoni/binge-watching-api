import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import { getUserByUsername } from '../users/users.model.js';

type TokenData = {
    sub: number;
    name: string;
};

async function generateToken(data: TokenData, duration: string) {
    return jwt.sign(data, env.SECRET_KEY, {
        expiresIn: duration,
        algorithm: 'HS256',
    });
}

async function verifyUser(username: string, password: string) {
    const user = await getUserByUsername(username);
    if (!user) {
        return {
            status: 'error',
            message: `User not found with username: ${username}`,
            statusCode: 404,
        };
    }

    if (user.active !== 1) {
        return {
            status: 'error',
            message: 'User is not active',
            statusCode: 403,
        };
    }

    if (password !== user.password) {
        return {
            status: 'error',
            message: `Wrong username or password`,
            statusCode: 400,
        };
    }

    return {
        status: 'OK',
        user: user,
    };
}

export { generateToken, verifyUser };
