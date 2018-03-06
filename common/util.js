'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = 10;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const TOKEN_LIFETIME = process.env.TOKEN_LIFETIME;

const hashPassword = (plainPassword) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(plainPassword, SALT_ROUNDS, (err, hash) => {
            if (err) {
                return reject({
                    "status": 400,
                    "title": 'Error during password hash'
                });
            }

            resolve(hash);
        });
    });
};

const validatePassword = (user, password) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (err, res) => {
            if (err) {
                return reject(err);
            }

            if (!res) {
                return reject(new AppError(400, 'That email address and password combination is not valid. Please try again!'));
            }

            resolve(true);
        });
    });
};

const generateToken = (user) => {
    const tokenProperties = {
        userId: user.id,
        name: user.name,
        email: user.email
    };

    const option = {
        algorithm: 'HS512',
        expiresIn: TOKEN_LIFETIME
    };

    return new Promise((resolve, reject) => {
        jwt.sign(tokenProperties, JWT_SECRET_KEY, option, (err, token) => {
            if (err) {
                return reject(err);
            }
            resolve({ token })
        });
    });
};

const validateToken = (rawToken) => {
    const token = rawToken.split(' ')[1];
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                return reject(new AppError(401, 'Failed to authentikate token.'));
            }
            resolve(decoded);
        });
    });
};

const errorHandling = (e, next) => {
    try {
        console.log(e);
        if (e instanceof AppError) {
            next(e);
        } else {
            const error = new Error('Internal server error');
            error.status = 500;
            next(error);
        }
    } catch (e) {
        console.error(e);
        const error = new Error('Internal server error');
        error.status = 500;
        next(error);
    }
};

module.exports = {
    hashPassword,
    validatePassword,
    generateToken,
    validateToken,
    errorHandling
};