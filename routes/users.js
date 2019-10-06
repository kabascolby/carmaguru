const isAuth = require('../utility/is-auth');

const path = require('path');
const express = require('express');

const mainPath = require('../utility/path');

const usersController = require('../controllers/users');


const router = express.Router();

router.get('/users', (req, res, next) => {
    res.render('users', { pageTitle: 'User Settings' });
});

router.get('/settings', isAuth.isOff, usersController.getUserSettings);

router.post('/settings', usersController.postUserSettings);

module.exports = router;