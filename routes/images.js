const express = require('express');
const imagesController = require('../controllers/images');
const isAuth = require('../utility/is-auth');

const router = express.Router();

router.get('/images', imagesController.getImages);

router.post('/images/comments', imagesController.postComments);
router.get('/images/comments', imagesController.getImageComments);

router.get('/images/:imageId', imagesController.getImageDetails);
router.post('/images/likes', imagesController.postLikes);
router.delete('/images/likes', imagesController.deleteLikes);


module.exports = router;