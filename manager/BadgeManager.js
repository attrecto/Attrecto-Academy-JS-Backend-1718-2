'use strict';

const database = rootRequired('database');
const path = require('path');
const dbPath = path.resolve(__dirname, '..', 'database', 'education.db');

const getBadges = async () => {
    await database.open(dbPath);

    const query = "SELECT * FROM badges";

    return database.all(query);
};

const createBadge = async (message) => {};

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