const express = require('express');

const userData = require('./signIn').users;

const router = express.Router();

router.get('/api/admin', (req, res, next) => {
    res.render('admin', {
        pageTitle: 'admin',
        pagePath: '/api/admin',
        users: userData
    });
});

module.exports = router;