const path = require('path');
const mainPath = require('../utility/path');



exports.getImages = (req, res, next) => {
    res.sendFile(path.join(mainPath, 'views', 'images.html'))
};

exports.displayImages = (req, res, next) => {
    res.render('index', {
        pageTitle: 'Welcome To Tof-Tof',
        pagePath: '/'
    });
};