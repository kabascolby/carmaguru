const path = require('path');
const express = require('express');

const mainPath = require('../utility/path');

const router = express.Router();

router.get('/users', (req, res, next) => {
    res.render('users', { pageTitle: 'User Settings' });
});

module.exports = router;