'use strict';

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

    const password = await util.hashPassword(userObject.password);

    await database.runWithPrepareStatement(createUserQuery, [
        userObject.email,
        userObject.name,
        password
    ]);

    const selectUserQuery = `SELECT id, email, name FROM users WHERE email= ?`;
    // no need await here, because in higher level there will be one. 
    return database.get(selectUserQuery, [email]);
};

const login = async (message) => {
    const {
        data: {email, password}
    } = message;

    if (!email || !password) {
        throw new AppError(400, 'Missing or empty fields!');
    }


    const user = await getUserByEmail({email});
    if (!user) {
        throw new AppError(400, 'This email address and password combination is not valid. Please try again!')
    }

    const isValidPassword = await util.validatePassword(user, password);
    if (!isValidPassword) {
        throw new AppError(400, 'This email address and password combination is not valid. Please try again!')
    }

    return util.generateToken(user);
};


const getUserByEmail = async (message) => {
    const {
        email
    } = message;

    await database.open(dbPath);

    if (!email) {
        throw new AppError(400, 'Missing or empty fields!');
    }

    const selectUserQuery = `SELECT id, email, name, password FROM users WHERE email= ?`;
    return database.get(selectUserQuery, [email]);
};

module.exports = {
    createUser,
    login
};