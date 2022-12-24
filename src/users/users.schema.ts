import bcrypt from 'bcrypt';
import { Schema } from 'express-validator';

const postUserSchema: Schema = {
    email: {
        isLength: {
            options: { min: 8, max: 50 },
            errorMessage: 'Email must be at least 8 chars and max 30 chars',
            bail: true,
        },
        isEmail: { errorMessage: 'Email is not valid', bail: true },
    },
    username: {
        isLength: {
            errorMessage: 'Username must be at least 8 chars and max 30 chars',
            options: { min: 6, max: 30 },
            bail: true,
        },
        matches: {
            errorMessage: 'Username is not valid',
            options: /^[A-Za-z\d_]+[A-Z-a-z-_\d_\-.]+(?![\/]+)[A-Za-z\d_]$/gm,
            bail: true,
        },
    },
    password: {
        isLength: {
            errorMessage: 'Password must be at least 8 chars and max 30 chars',
            options: { min: 8, max: 30 },
            bail: true,
        },
        matches: {
            errorMessage: 'Password is not valid',
            options: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[.!?_\-])[0-9a-zA-Z!?_\-.]{8,}$/gm,
            bail: true,
        },
        custom: {
            errorMessage: 'Password and confirm password do not match',
            options: (value, { req }) => value === req.body!.confirmPassword,
            bail: true,
        },
    },
};

const putPasswordSchema: Schema = {
    oldPassword: {
        custom: {
            errorMessage: 'Your old password is wrong',
            options: (value, { req }) =>
                bcrypt.compare(value, req.body.user.password).then(res => res),
            bail: true,
        },
    },
    newPassword: {
        isLength: {
            errorMessage: 'Password must be at least 8 chars and max 30 chars',
            options: { min: 8, max: 30 },
            bail: true,
        },
        matches: {
            errorMessage: 'Password is not valid',
            options: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[.!?_\-])[0-9a-zA-Z!?_\-.]{8,}$/gm,
            bail: true,
        },
    },
};

export { postUserSchema, putPasswordSchema };
