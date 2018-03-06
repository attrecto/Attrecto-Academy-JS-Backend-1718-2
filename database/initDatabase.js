'use strict';
const path = require('path');
const fs = require('fs');
const database = require('./index');
const util = require('../common/util');

const dbPath = path.resolve(__dirname, 'education.db');
const userDataPath = path.resolve(__dirname, 'initdata', 'initUser.json');

const createUserTable = async () => {
    await database.open(dbPath);
    await database.run('DROP TABLE IF EXISTS users;');
    await database.run('CREATE TABLE users(id INTEGER PRIMARY KEY AUTOINCREMENT, email text, name text, password text);');

    const query = `INSERT INTO users(email, name, password) VALUES (?, ?, ?)`;
    const lstUser = JSON.parse(fs.readFileSync(userDataPath, 'utf8'));

    for (let i = 0; i < lstUser.length; i++) {
        let user = lstUser[i];
        user.password = await util.hashPassword(user.password);
        await database.runWithPrepareStatement(query, [user.email, user.name, user.password]);
    }

    const userRows = await database.all(`SELECT * FROM users`);
    console.log(userRows);

    database.close();

    return userRows;
};

createUserTable().catch((e) => {
    console.log(e);
});
