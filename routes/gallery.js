const express = require('express');
const galleriesController = require('../controllers/gallery')

const mainPath = require('../utility/path');

const router = express.Router();

router.get('/gallery', galleriesController.getGallery);

router.post('/gallery', galleriesController.postImages);
module.exports = router;