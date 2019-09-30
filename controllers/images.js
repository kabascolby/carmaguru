const path = require('path');
const mainPath = require('../utility/path');
const ImageClass = require('../models/imagesDb');
const CommentClass = require('../models/feedbacksDb');
const utility = require('../utility/util');
const bcrypt = require('bcryptjs');
const ITEMS_PER_PAGE = 9;
let totalItems;

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


exports.getIndex = (req, res, next) => {

    ImageClass.totalItems()
        .then(([
            [numItems]
        ]) => {
            totalItems = numItems.total;
            const page = Math.abs(req.query.page) || 1;
            const skip = (page - 1) * ITEMS_PER_PAGE;
            ImageClass.fetchPerPage(skip, ITEMS_PER_PAGE, (images) => {
                res.render('index', {
                    pageTitle: 'Welcome To Tof-Tof',
                    pagePath: '/',
                    imgs: images,
                    userId: req.session.userId,
                    totalItems,
                    currentPage: page,
                    hasNextPage: (ITEMS_PER_PAGE * page) < totalItems,
                    hasPreviousPage: page > 1,
                    nextPage: page + 1,
                    previousPage: page - 1,
                    lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
                });
            });
        })
        .catch(e => console.error(e));
};


/* 
	displaying a single image informations (likes and comments)
	also same user images

	work to Do Here by changing by finding the user Id and and displaying all the  images belongin to that user
*/

exports.getImageDetails = (req, res, next) => {
    const imgId = req.params.imageId;
    CommentClass.fetchCmtsByImages(imgId)
        .then(([result]) => {
            ImageClass.findOneImgs(imgId, images => {
                if (images) {
                    const img = images.find(img => img.id === imgId);
                    res.render('images', {
                        pageTitle: 'Image Details',
                        pagePath: '/images',
                        userId: req.session.userId,
                        imgs: images,
                        mainImg: img,
                        cmts: result
                    });
                } else {
                    res.redirect('/404')
                }
            });
        })
        .catch(e => {
            req.flash('error', 'Ressources not found');
            console.error(e);
            return res.redirect('/404')
        })

};

/* ------------------------------------------------- comments API----------------------------------------------- */

exports.postComments = (req, res, next) => {
        const userId = req.body.userId;
        const imgId = req.body.imgId;
        const comment = req.body.comment;
        const id = utility.create_UUID();

        const cmtDb = new CommentClass(id, userId, imgId, comment)
        cmtDb.save()
            .then(([result]) => {
                if (result.warningStatus) {
                    console.error(new Error('Insertion in the DB FAIL', e));
                    return res.status(500).json('Internal Server Error');
                }
                return CommentClass.fetchCmtAndUser(id);
            })
            .then(([
                [result]
            ]) => {
                if (result)
                    res.status(200).json({
                        id,
                        firstName: result.firstName,
                        lastName: result.lastName
                    });
            })
            .catch(e => {
                res.status(500).json('Internal Server Error');
                console.log(e);
            })
    }
    /* ______________________________________________________________________________________________________________________ */