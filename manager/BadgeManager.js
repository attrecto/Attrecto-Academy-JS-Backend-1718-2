'use strict';

const database = rootRequired('database');
const path = require('path');
const dbPath = path.resolve(__dirname, '..', 'database', 'education.db');

const getBadges = async () => {
    await database.open(dbPath);

    const query = "SELECT * FROM badges";

    return database.all(query);
};

const createBadge = async (message) => {
    const {
        data: createData
    } = message;

    await database.open(dbPath);

    //check name
    const name = createData.name;
    let checkBadgeQuery = `SELECT * FROM badges WHERE name = ?`;
    const foundBadge = await database.get(checkBadgeQuery, [name]);
    if (foundBadge) {
        throw new AppError(400, "Badge already exists with this name.");
    }

    const createBadgeQuery = `INSERT INTO badges(name, description) VALUES (?, ?)`;

    await database.runWithPrepareStatement(createBadgeQuery, [
        createData.name,
        createData.description
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

const updateBadge = async (message) => {
    const {
        id,
        data: updateData
    } = message;

    await database.open(dbPath);

    const query = "SELECT * FROM badges WHERE id = ?";
    const badge = await database.get(query, [id]);

    if (!badge) {
        throw new AppError(404, 'Badge not found!')
    }

    //check name
    const name = updateData.name;
    let checkBadgeQuery = `SELECT id, name, description FROM badges WHERE name = ?`;
    const foundBadge = await database.get(checkBadgeQuery, [name]);
    if (foundBadge) {
        throw new AppError(400, "Badge already exists with this name.");
    }

    Object.assign(badge, {
        name: typeof updateData.name === 'string' && updateData.name.length ? updateData.name : badge.name,
        description: typeof updateData.description  === 'string' ? updateData.description : badge.description
    });

    const updateBadgeQuery = `UPDATE badges SET name = ?, description = ? WHERE id = ?`;

    await database.runWithPrepareStatement(updateBadgeQuery, [
        badge.name,
        badge.description,
        id
    ]);

    return badge;
};

const deleteBadge = async (message) => {
    const {id} = message;

    await database.open(dbPath);

    const query = "SELECT * FROM badges WHERE id = ?";
    const badge = await database.get(query, [id]);

    if (!badge) {
        throw new AppError(404, 'Badge not found!')
    }

    const deleteQuery = `DELETE FROM badges WHERE id = ?`;

    await database.runWithPrepareStatement(deleteQuery, [id]);

    return;
};

module.exports = {
    getBadges,
    getBadge,
    createBadge,
    updateBadge,
    deleteBadge
};