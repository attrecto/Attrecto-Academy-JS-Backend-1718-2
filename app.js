'use strict'

global.rootRequired = (name) => {
    return require(__dirname + '/' + name);
};

require('dotenv').config();
const express = require('express');

const app = express();

module.exports = app;