// const path = require('path');
const express = require('express');

const mainPath = require('../utility/path');

const router = express.Router();

router.get('/gallery', (req, res, next) => {
    res.render('gallery', {
        pageTitle: 'Gallery Studio',
        pagePath: '/gallery'
    });
});

module.exports = router;