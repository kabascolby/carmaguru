const path = require('path');
const mainPath = require('../utility/path');
const ImageClass = require('../models/imagesDb');
const uid = 'd3a9a91e-d4ed-11e9-85d5-0242ac110002';



exports.getImages = (req, res, next) => {
    ImageClass.fetchBinary(uid, images => {
        res.render('images', {
            pageTitle: 'Image Details',
            pagePath: '/images',
            mainImg: images[0],
            imgs: images
        });
    });
};


exports.displayImages = (req, res, next) => {
    ImageClass.fetchBinary(uid, images => {
        res.render('index', {
            pageTitle: 'Welcome To Tof-Tof',
            pagePath: '/',
            imgs: images
        });
    });
};


/* 
	displaying a single image informations (likes and comments)
	also same user images
*/
exports.getImageDetails = (req, res, next) => {
    const imgId = req.params.imageId;
    ImageClass.fetchBinary(uid, images => {
        let imgs = images.find(img => img.id === imgId);
        if (imgs) {
            res.render('images', {
                pageTitle: 'Image Details',
                pagePath: '/images',
                imgs: images,
                mainImg: imgs
            });
        } else {
            res.redirect('/404')
        }
    });
};