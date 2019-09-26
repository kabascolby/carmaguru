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
        });
    });
};


exports.displayImages = (req, res, next) => {
    ImageClass.fetchAll(images => {
        res.render('index', {
            pageTitle: 'Welcome To Tof-Tof',
            pagePath: '/',
            imgs: images,
            userId: req.session.userId
        });
    });
};


/* 
	displaying a single image informations (likes and comments)
	also same user images

	work to Do Here by changing by finding the user Id and and displaying all the  images belongin to that user
*/

exports.getImageDetails = (req, res, next) => {
    const imgId = req.params.imageId;
    ImageClass.findOneImgs(imgId, images => {
        if (images) {
            const img = images.find(img => img.id === imgId);
            res.render('images', {
                pageTitle: 'Image Details',
                pagePath: '/images',
                imgs: images,
                mainImg: img,
            });
        } else {
            res.redirect('/404')
        }
    });
};