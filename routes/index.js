'use strict'

const express = require('express');
const router = express.Router();

router.get('/hello', (req, res, next) => {
    res.send('Hello world!!!');
});

module.exports = router;

