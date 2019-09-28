const express = require('express');

const usersController = require('../controllers/users');
const isAuth = require('../utility/is-auth');

const router = express.Router();

router.get('/login', isAuth.isOn, usersController.getUserLoginPage);

router.post('/login', usersController.postUserLoginPage);

router.get('/logout', usersController.getLogout);

router.get('/reset', usersController.getReset);
router.post('/reset', usersController.postReset);
router.get('/reset/:token', isAuth.isOn, usersController.getNewPassword);
router.post('/new-password', usersController.postNewPassword);

module.exports = router;