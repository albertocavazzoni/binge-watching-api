import bcrypt from 'bcrypt';
import { Schema } from 'express-validator';
import { getUserByUsername } from './users.model.js';

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
            options: async (value, { req }) => {
                const verifyPassword = await bcrypt.compare(value, req.body!.user.password);
                if (!verifyPassword) {
                    throw new Error();
                }
            },
            bail: true,
        },
    },
    newPassword: {
        custom: {
            errorMessage: 'Your old and new password are equals',
            options: (value, { req }) => value !== req.body!.oldPassword,
        },
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

const putUsernameSchema: Schema = {
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
        custom: {
            errorMessage: 'Username already exists',
            options: async value => {
                const result = await getUserByUsername(value);
                if (result) {
                    throw new Error();
                }
            },
        },
    },
};

export { postUserSchema, putPasswordSchema, putUsernameSchema };
