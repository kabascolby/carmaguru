const express = require('express');
const imagesController = require('../controllers/images');

const router = express.Router();

router.get('/images', imagesController.getImages);

module.exports = router;