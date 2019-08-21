exports.getGallery = (req, res, next) => {
    res.render('gallery', {
        pageTitle: 'Gallery Studio',
        pagePath: '/gallery'
    });
};

exports.postImages = (req, res, next) => {
    console.log(req.body);
}