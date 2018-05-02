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

const addBadgeToUser = async (message) => {
  const {
    userId,
    badgeId
  } = message;

  await database.open(dbPath);

  //check user
  const userCountQuery = "SELECT COUNT(*) AS count FROM users WHERE id = ?";
  const userCount = await database.get(userCountQuery, [userId]);
  if (userCount.count === 0) {
    throw new AppError(404, 'User not found!');
  }

  //check badge
  const badgeCountQuery = "SELECT COUNT(*) AS count FROM badges WHERE id = ?";
  const badgeCount = await database.get(badgeCountQuery, [badgeId]);
  if (badgeCount.count === 0) {
    throw new AppError(404, 'Badge not found!');
  }

  //check user badge
  const userBadgeCountQuery = "SELECT COUNT(*) AS count FROM user_badges WHERE user_id = ? AND badge_id = ?";
  const userBadgeCount = await database.get(userBadgeCountQuery, [userId, badgeId]);
  if (userBadgeCount.count > 0) {
    throw new AppError(400, 'User has already connected with the selected badge!');
  }

  const updateUserBadgesQuery = `INSERT INTO user_badges (user_id, badge_id) values (?, ?)`;

  await database.runWithPrepareStatement(updateUserBadgesQuery, [
    userId,
    badgeId
  ]);

  //check user badge
  const userBadgeQuery = "SELECT * FROM user_badges WHERE user_id = ? AND badge_id = ?";
  return await database.get(userBadgeQuery, [userId, badgeId]);
};

module.exports = {
    createUser,
    login,
    addBadgeToUser
};