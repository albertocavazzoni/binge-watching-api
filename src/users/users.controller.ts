import { Request, Response } from 'express';
import { registerUser, updatePassword } from './users.model.js';

async function postUser(req: Request, res: Response) {
    const result = await registerUser(req.body);
    if (result.status === 'OK') {
        return res.status(result.statusCode).send({ status: result.status, data: result.data });
    } else {
        return res.status(result.statusCode).send({ status: result.status, error: result.error });
    }
}

async function putPassword(req: Request, res: Response) {
    const result = await updatePassword(req.body.user.id, req.body.newPassword);
    return res.status(202).send({ status: result.status, data: result.data });
}

export { postUser, putPassword };
