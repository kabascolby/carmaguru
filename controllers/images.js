const path = require('path');
const mainPath = require('../utility/path');
const ImageClass = require('../models/imagesDb');



exports.getImages = (req, res, next) => {
    ImageClass.fetchBinary('brianbixby0@gmail.com', images => {
        res.render('images', {
            pageTitle: 'Image Details',
            pagePath: '/images',
            mainImg: images[0],
            imgs: images
        });
    });
};


exports.displayImages = (req, res, next) => {
    ImageClass.fetchBinary('brianbixby0@gmail.com', images => {
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
    ImageClass.fetchBinary('brianbixby0@gmail.com', images => {
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