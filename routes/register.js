// user registration route

const express = require('express');

const router = express.Router();

const usersController = require('../controllers/users');
const isAuth = require('../utility/is-auth');


router.get('/signIn', isAuth.isOn, usersController.getUserRegistration);

router.post('/signIn', usersController.postUserRegistration);

module.exports = router;