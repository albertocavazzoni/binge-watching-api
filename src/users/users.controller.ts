import { Request, Response } from 'express';
import { getUserByUsername } from './users.model.js';

async function getMe(req: Request, res: Response) {
    return res
        .status(200)
        .send(await getUserByUsername(req.body.user.username));
}

export { getMe };
