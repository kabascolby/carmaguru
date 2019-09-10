const express = require('express');
const galleriesController = require('../controllers/gallery')

const mainPath = require('../utility/path');

const router = express.Router();

router.get('/gallery', galleriesController.getGallery);

router.post('/gallery/meta-data', galleriesController.postImages);
router.post('/gallery/edit', galleriesController.postImageEdit);

router.put('/gallery/update', galleriesController.putImageUpdate);

router.delete('/gallery', galleriesController.deleteImage);
module.exports = router;