const express = require('express');
const imagesController = require('../controllers/images');

const router = express.Router();

router.get('/', imagesController.displayImages);

module.exports = router;