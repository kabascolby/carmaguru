const express = require('express');

const usersController = require('../controllers/users');
const isAuth = require('../utility/is-auth');

const router = express.Router();

router.get('/login', isAuth.isOn, usersController.getUserLoginPage);

router.post('/login', usersController.postUserLoginPage);

router.get('/logout', usersController.getLogout);

router.get('/reset', usersController.getReset);
router.post('/reset', usersController.postReset);


/* [ kabascolby: { first: 'Lamine',
last: 'Kaba',
username: 'kabascolby',
email: 'brianbixby0@gmail.com',
psw: 'foodfood',
submit: 'Register' } ] */


module.exports = router;