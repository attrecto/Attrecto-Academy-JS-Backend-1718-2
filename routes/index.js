'use strict'

const express = require('express');
const router = express.Router();
const { userManager } = rootRequired("manager");
const util = rootRequired("common/util");

router.post('/user', async (req, res, next) => {
    try {
        const message = {
            data: req.body
        };

        const result = await userManager.createUser(message);
        res.send(result);
    } catch (e) {
        util.errorHandling(e, next);
    }
})

router.get('/hello', (req, res, next) => {
    res.send('Hello world!!!');
});

module.exports = router;

