import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import env from './env.js';
import { getUserByUsername } from '../users/users.model.js';

async function isAuth(req: Request, res: Response, next: NextFunction) {
    if (req.path.includes('/auth')) {
        return next();
    }
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res
            .status(401)
            .send({ status: 'error', message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const verified = jwt.verify(token, env.SECRET_KEY);
        // @ts-ignore Can't change type of payload
        const user = await getUserByUsername(verified.name);
        if (!user || user.active !== 1) {
            return res.status(404).send({
                status: 'error',
                message: 'Problem with authentication',
            });
        }
        req.body.user = user;
        return next();
    } catch (err) {
        return res
            .status(401)
            .send({ status: 'error', message: 'Unauthorized' });
    }
}

// Always call after isAuth
async function isAdmin(req: Request, res: Response, next: NextFunction) {
    if (req.body.user!.role !== 55) {
        return res
            .status(401)
            .send({ status: 'error', message: 'Unauthorized' });
    }

    next();
}

export { isAuth, isAdmin };
