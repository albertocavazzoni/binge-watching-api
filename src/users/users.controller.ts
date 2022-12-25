import { Request, Response } from 'express';
import { registerUser, updatePassword, updateUsername } from './users.model.js';

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
    if (result.status === 'OK') {
        return res.status(202).send({ status: result.status, affectedRows: result.data });
    } else {
        return res.status(422).send({ status: result.status, error: result.error });
    }
}

async function putUsername(req: Request, res: Response) {
    const result = await updateUsername(req.body.user.id, req.body.username);
    if (result.status === 'OK') {
        return res.status(202).send({ status: result.status, affectedRows: result.data });
    } else {
        return res.status(422).send({ status: result.status, error: result.error });
    }
}

export { postUser, putPassword, putUsername };
