const path = require('path');
const express = require('express');

const mainPath = require('../utility/path');

const router = express.Router();

router.get('/', (req, res, next) => {
    res.sendFile(path.join(mainPath, 'views', 'index.html'));
});

module.exports = router;