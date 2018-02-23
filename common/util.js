'use strict'

const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

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
    errorHandling
}