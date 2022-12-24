import { Request, Response } from 'express';
import { getUserByUsername, registerUser } from './users.model.js';

async function getMe(req: Request, res: Response) {
    return res.status(200).send(await getUserByUsername(req.body.user.username));
}

async function postUser(req: Request, res: Response) {
    const result = await registerUser(req.body);
    if (result.status === 'OK') {
        return res.status(result.statusCode).send({ status: result.status, data: result.data });
    } else {
        return res.status(result.statusCode).send({ status: result.status, error: result.error });
    }
}

export { getMe, postUser };
