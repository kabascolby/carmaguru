const path = require('path');
const express = require('express');

const mainPath = require('../utility/path');

const router = express.Router();

router.get('/images', (req, res, next) => {
    res.sendFile(path.join(mainPath, 'views', 'images.html'))
});

module.exports = router;