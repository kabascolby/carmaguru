const express = require('express');
const imagesController = require('../controllers/images');

const router = express.Router();

router.get('/images', imagesController.getImages);

// router.post('/images', imagesController.commentImages)

module.exports = router;