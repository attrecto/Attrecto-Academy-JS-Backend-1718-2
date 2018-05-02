'use strict';

const database = rootRequired('database');
const path = require('path');
const dbPath = path.resolve(__dirname, '..', 'database', 'education.db');

const getBadges = async (message) => {
  await database.open(dbPath);

  const query = "SELECT * FROM badges";

  return database.all(query);
};

const createBadge = async (message) => {
  const {
    data: badgeObject
  } = message;

  await database.open(dbPath);

  //check name
  const name = badgeObject.name;
  let checkBadgeQuery = `SELECT * FROM badges WHERE name = ?`;
  const foundBadge = await database.get(checkBadgeQuery, [name]);
  if (foundBadge) {
    throw new AppError(400, "Badge already exists with this name.");
  }

  const createBadgeQuery = `INSERT INTO badges(name, description) VALUES (?, ?)`;

  await database.runWithPrepareStatement(createBadgeQuery, [
    badgeObject.name,
    badgeObject.description
  ]);

  const selectBadgeQuery = `SELECT * FROM badges WHERE name = ?`;

  return database.get(selectBadgeQuery, [name]);
};

const getBadge = async (message) => {
  const {id} = message;

  await database.open(dbPath);

  const query = "SELECT * FROM badges WHERE id = ?";
  const badge = await database.get(query, [id]);

  if (!badge) {
    throw new AppError(404, 'Badge not found!')
  }

  return badge;
};

const updateBadge = async (message) => {};

const deleteBadge = async (message) => {};

module.exports = {
  getBadges,
  getBadge,
  createBadge,
  updateBadge,
  deleteBadge
};