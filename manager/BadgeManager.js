'use strict';

const database = rootRequired('database');
const path = require('path');
const dbPath = path.resolve(__dirname, '..', 'database', 'education.db');

const getBadges = async (message) => {};

const createBadge = async (message) => {};

const getBadge = async (message) => {};

const updateBadge = async (message) => {};

const deleteBadge = async (message) => {};

module.exports = {
  getBadges,
  getBadge,
  createBadge,
  updateBadge,
  deleteBadge
};