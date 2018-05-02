'use strict';

const express = require('express');
const router = express.Router();
const { userManager, badgeManager } = rootRequired('manager');
const util = rootRequired('common/util');
const authorization = rootRequired('middleware/authorization');

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
});

router.post('/login', async (req, res, next) => {
    try {
        const message = {
            data: req.body
        };

        const result = await userManager.login(message);
        res.send(result);
    } catch (e) {
        util.errorHandling(e, next);
    }
});

router.use(authorization);

router.get('/hello', (req, res, next) => {
    res.send(`Hello ${req.tokenDetails.name}!`);
});

router.get('/badge/:badgeId', async (req, res, next) => {
  try {
    const message = {
      id: req.params.badgeId
    };

    const result = await badgeManager.getBadge(message);
    res.send(result);
  } catch (e) {
    util.errorHandling(e, next);
  }
});

router.patch('/badge/:badgeId', async (req, res, next) => {
  try {
    const message = {
      id: req.params.badgeId,
      data: req.body
    };

    const result = await badgeManager.updateBadge(message);
    res.send(result);
  } catch (e) {
    util.errorHandling(e, next);
  }
});

router.post('/badge/', async (req, res, next) => {
  try {
    const message = {
      data: req.body
    };

    const result = await badgeManager.createBadge(message);
    res.send(result);
  } catch (e) {
    util.errorHandling(e, next);
  }
});

router.get('/badge', async (req, res, next) => {
  try {
    const result = await badgeManager.getBadges();
    res.send(result);
  } catch (e) {
    util.errorHandling(e, next);
  }
});

module.exports = router;

