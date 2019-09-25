const path = require('path');
const mainPath = require('../utility/path');
const ImageClass = require('../models/imagesDb');
// const uid = 'd3a9a91e-d4ed-11e9-85d5-0242ac110002';



exports.getImages = (req, res, next) => {
    ImageClass.fetchBinary(req.session.userId, images => {
        res.render('images', {
            pageTitle: 'Image Details',
            pagePath: '/images',
            mainImg: images[0],
            imgs: images,
            isAuth: req.session.isLoggedIn
        });
    });
};


exports.displayImages = (req, res, next) => {
    ImageClass.fetchAll(images => {
        res.render('index', {
            pageTitle: 'Welcome To Tof-Tof',
            pagePath: '/',
            imgs: images,
            isAuth: req.session.isLoggedIn,
            userId: req.session.userId
        });
    });
};


/* 
	displaying a single image informations (likes and comments)
	also same user images
*/
exports.getImageDetails = (req, res, next) => {
    const imgId = req.params.imageId;
    ImageClass.fetchBinary(req.session.userId, images => {
        let imgs = images.find(img => img.id === imgId);
        if (imgs) {
            res.render('images', {
                pageTitle: 'Image Details',
                pagePath: '/images',
                imgs: images,
                mainImg: imgs,
                isAuth: req.session.isLoggedIn
            });
        } else {
            res.redirect('/404')
        }
    });
};