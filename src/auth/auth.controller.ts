import { Request, Response } from 'express';
import { generateToken, verifyUser } from './auth.model.js';

async function login(req: Request, res: Response) {
    const username: string = req.body.username;
    const password: string = req.body.password;

    const verified = await verifyUser(username, password);
    if (
        verified.status === 'error' &&
        (!verified.data || !verified.data.user)
    ) {
        return res.status(verified.statusCode!).send({
            status: verified.status,
            message: verified.message,
        });
    }

    const user = verified.data?.user!;

    const tokenDuration = req.body.keepMeLoggedIn ? '15d' : '1d';

    const tokenData = { sub: user.id, name: user.username };

    const token = await generateToken(tokenData, tokenDuration);

    return res.status(200).send({ status: 'OK', data: { token } });
}

export { login };
