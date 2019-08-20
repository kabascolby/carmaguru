exports.getGallery = (req, res, next) => {
    res.render('gallery', {
        pageTitle: 'Gallery Studio',
        pagePath: '/gallery'
    });
};