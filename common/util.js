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

module.exports = {
    hashPassword
}