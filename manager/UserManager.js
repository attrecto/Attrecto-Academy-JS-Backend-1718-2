'use strict'

const database = rootRequired('database');
const util = rootRequired('common/util');
const path = require('path');
const dbPath = path.resolve(__dirname, '..', 'database', 'education.db');

const createUser = async (message) => {
    const {
        data: userObject
    } = message;

    await database.open(dbPath);

    //check email
    const email = userObject.email;
    let checkEmailQuery = `SELECT * FROM users WHERE email = ?`;
    const foundUser = await database.get(checkEmailQuery, [email]);
    if (foundUser) {
        throw new AppError(400, "User already exists with this email.");
    }


    //create user
    const createUserQuery = `INSERT INTO users(email, name, password) VALUES (?, ?, ?)`;

    await database.runWithPrepareStatement(createUserQuery, [userObject.email, userObject.name, userObject.password]);

    const selectUserQuery = `SELECT id, email, name FROM users WHERE email= ?`;
    // no need await here, because in higher level there will be one. 
    return database.get(selectUserQuery, [email]);
}

module.exports = {
    createUser
}