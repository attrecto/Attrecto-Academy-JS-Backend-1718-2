'use strict';
const path = require('path');
const fs = require('fs');
const database = require('./index');
const util = require('../common/util');

const dbPath = path.resolve(__dirname, 'education.db');
const userDataPath = path.resolve(__dirname, 'initdata', 'initUser.json');
const badgeDataPath = path.resolve(__dirname, 'initdata', 'initBadge.json');

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

const createBadgeTable = async () => {
    await database.open(dbPath);
    await database.run('DROP TABLE IF EXISTS badges;');
    await database.run('CREATE TABLE badges(id INTEGER PRIMARY KEY AUTOINCREMENT, name text, description text);');
    await database.run(`
        CREATE TABLE user_badges(
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            user_id integer NOT_NULL, 
            badge_id integer NOT_NULL,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (badge_id) REFERENCES badges(id)
        );
    `);

    const query = `INSERT INTO badges(name, description) VALUES (?, ?)`;
    const lstBadge = JSON.parse(fs.readFileSync(badgeDataPath, 'utf8'));

    for (let i = 0; i < lstBadge.length; i++) {
        let badge = lstBadge[i];
        await database.runWithPrepareStatement(query, [badge.name, badge.description]);
    }

    const badgeRows = await database.all(`SELECT * FROM badges`);
    console.log(badgeRows);

    database.close();

    return badgeRows;
};

// createUserTable()
//     .then(() => createBadgeTable())
//     .catch((e) => console.log(e));

Promise.resolve()
    .then(() => createUserTable())
    .then(() => createBadgeTable())
    .catch((e) => console.log(e));
