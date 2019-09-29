const express = require('express');
const imagesController = require('../controllers/images');

const router = express.Router();

router.get('/', imagesController.getIndex);

module.exports = router;