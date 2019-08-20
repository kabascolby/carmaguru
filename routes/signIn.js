const express = require('express');

const router = express.Router();

const usersController = require('../controllers/users');


router.get('/signIn', usersController.getUserSigninPage);

router.post('/signIn', usersController.postUserSigninPage);

module.exports = router;