const path = require('path');
const express = require('express');

const mainPath = require('../utility/path');

const router = express.Router();

router.get('/users', (req, res, next) => {
    res.sendFile(path.join(mainPath, 'views', 'users.html'))
});

module.exports = router;