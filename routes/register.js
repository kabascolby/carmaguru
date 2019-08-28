// user registration route

const express = require('express');

const router = express.Router();

const usersController = require('../controllers/users');


router.get('/signIn', usersController.getUserRegistration);

router.post('/signIn', usersController.postUserRegistration);

module.exports = router;