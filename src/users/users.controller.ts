import { Request, Response } from 'express';
import { getUserByUsername, registerUser } from './users.model.js';
import { validationResult } from 'express-validator';

async function getMe(req: Request, res: Response) {
    return res.status(200).send(await getUserByUsername(req.body.user.username));
}

async function postUser(req: Request, res: Response) {
    const p = validationResult(req);
    console.log(p);

    const result = await registerUser(req.body);
    if (result.status === 'OK') {
        return res.status(result.statusCode).send({ status: result.status, data: result.data });
    } else {
        return res
            .status(result.statusCode)
            .send({ status: result.status, message: result.message });
    }
}

export { getMe, postUser };
