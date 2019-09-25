const express = require('express');

const usersController = require('../controllers/users');

const router = express.Router();

router.get('/login', usersController.getUserLoginPage);

router.post('/login', usersController.postUserLoginPage);

router.get('/logout', usersController.getLogout);

/* [ kabascolby: { first: 'Lamine',
last: 'Kaba',
username: 'kabascolby',
email: 'brianbixby0@gmail.com',
psw: 'foodfood',
submit: 'Register' } ] */


module.exports = router;