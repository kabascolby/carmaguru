const express = require('express');

// const mainPath = require('../utility/path');

const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('index', {
        pageTitle: 'Welcome To Tof-Tof',
        pagePath: '/'
    });
});

module.exports = router;