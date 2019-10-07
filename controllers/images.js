const path = require('path');
const mainPath = require('../utility/path');
const ImageClass = require('../models/imagesDb');
const CommentClass = require('../models/feedbacksDb');
const LikesClass = require('../models/likesDb');
const UserClass = require('../models/usersDb');
const utility = require('../utility/util');
const sgMail = require('../utility/mail');
const ITEMS_PER_PAGE = 6;
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
    const userId = req.session.userId;
    let usersComments;

    CommentClass.fetchCmtsByImages(imgId)
        .then(([result]) => {
            usersComments = result;
            if (userId)
                return LikesClass.fetchLikesByImages(imgId, userId);
            return [
                [undefined]
            ];
        })
        .then(([
            [likes]
        ]) => {

            ImageClass.findOneImgs(imgId, images => {
                if (images) {
                    const img = images.find(img => img.id === imgId);
                    res.render('images', {
                        pageTitle: 'Image Details',
                        pagePath: '/images',
                        userId: req.session.userId,
                        imgs: images,
                        mainImg: img,
                        ow: img.user_id,
                        cmts: usersComments,
                        likeId: likes ? likes.id : undefined
                    });
                } else {
                    res.redirect('/404')
                }
            });
        })
        .catch(e => {
            req.flash('error', 'Ressources not found');
            console.error(e);
            res.redirect('/404')
        })

};

/* ------------------------------------------------- comments API----------------------------------------------- */

exports.postComments = (req, res, next) => {
    const userId = req.session.userId;
    const imgId = req.body.imgId;
    const comment = req.body.comment;
    const id = utility.create_UUID();
    let userData;
    if (!userId || !imgId) {
        return res.status(200).json("You're not authorize try to logIn");
    }

    const cmtDb = new CommentClass(id, userId, imgId, comment)
    cmtDb.save()
        .then(([result]) => {
            console.log('here')
            if (result.warningStatus) {
                console.error('Insertion in the DB FAIL', e);
                return res.status(500).json('Internal Server Error');
            }
            return CommentClass.fetchCmtAndUser(id);
        })
        .then(([
            [result]
        ]) => {
            userData = {
                id,
                firstName: result.firstName,
                lastName: result.lastName
            };
            // console.log(userData, req.session.userId);
            return CommentClass.updateNcomment(imgId);
        })
        .then(([result]) => {
            if (result.warningStatus) {
                console.error('Insertion in the DB FAIL', e);
                return res.status(500).json('Internal Server Error');
            }
            res.status(200).json(userData);


        })
        .catch(e => {
            res.status(500).json('Internal Server Error');
            console.log(e);
        })
}

exports.getImageComments = (req, res, next) => {
    const imgId = req.query.fetch;
    if (!req.session.userId) {
        req.flash('error', '😞You have to login to see others comments');
        return res.status(200).json([null, null]);
    } else {
        Promise.all([CommentClass.fetchCmtsByImages(imgId), LikesClass.fetchLikesByImages(imgId, req.session.userId)])
            .then(([
                [result],
                [
                    [result2]
                ]
            ]) => {
                if (!result) {
                    console.error(new Error('Get image data'));
                    return res.status(500).json('Invalide Image');
                }
                res.status(200).json([result, result2]);

            })
            .catch(e => {
                console.error(e);

            })
    }
}

/* ______________________________________________________________________________________________________________________ */

/* ------------------------------------------------------- Likes API ---------------------------------------------------- */

exports.postLikes = (req, res, next) => {
    const userId = req.body.userId;
    const imgId = req.body.imgId;
    const ownerId = req.body.owner;
    const id = utility.create_UUID();
    if (userId === ownerId) {
        return res.json("Sorry it's from you");
    }
    const likeDb = new LikesClass(id, userId, imgId);
    likeDb.save()
        .then(([result]) => {
            if (result.warningStatus) {
                console.error('Error Durring insertion\n', e);
                return res.status(200).json('Server Error try Later');
            }
            return LikesClass.addTotalLikes(imgId);
        })
        .then(([result]) => {
            if (result.warningStatus) {
                console.error('Error Durring insertion\n', e);
                return res.status(200).json('Server Error try Later');
            }
            res.json({ btnId: id });
            return Promise.all([UserClass.fetchByUserId(ownerId), UserClass.fetchByUserId(userId)]);
        })
        .then(([
            [
                [sender]
            ],
            [
                [user]
            ]
        ]) => {
            if (sender) {
                const msg = {
                    to: sender.email,
                    from: 'info@camagru.com',
                    subject: 'Like',
                    text: 'and easy to do anywhere, even with Node.js',
                    html: `<h2>Hi ${sender.firstname}  ${sender.lastname}</h2>
            			<h3>${user.firstname}  ${user.lastname} give you a like</h3>
            			<p>visit http://localhost:8080 for more details</p>`,
                };
                sgMail.send(msg, (err) => {
                    if (err)
                        console.error('error --------------->', err)
                });
            }
        })
        .catch(e => console.error('Error insertion in Like DB\n', e));

    //check if userId == currentImg user;

}



exports.deleteLikes = (req, res, next) => {
        const imgId = req.body.imgId;
        const id = req.body.id;
        const userId = req.session.userId;

        /* checking first the user Already likes */
        LikesClass.fetchLike(id)
            .then(([
                [result]
            ]) => {
                if (!result) {
                    console.error('invalide Id in LikeDB\n', e);
                    return res.status(200).json("You're not authorize");
                }
                return LikesClass.deductTotalLikes(imgId);
            })
            .then(([result]) => {
                if (result.warningStatus) {
                    console.error('Error During substraction \n', e);
                    return res.status(200).json('Server Error try Later');
                }
                return LikesClass.deleteLikes(id);
            })
            .then(([result]) => {
                if (result.warningStatus) {
                    console.error('Error During substraction \n', e);
                    return res.status(200).json('Server Error try Later');
                }
                res.status(200).json('SUCCESS');
                //sending a mail here will be a good idea

            })
            .catch(e => console.log('Error deleting like in DB', e));

    }
    /* ______________________________________________________________________________________________________________________ */