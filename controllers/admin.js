// const userData = require('./users').userDb;
const UserDb = require('../models/usersDb');

exports.getAdmin = (req, res, next) => {
    UserDb.fetchAll(data => {
        res.render('admin', {
            pageTitle: 'admin',
            pagePath: '/api/admin',
            users: data,
            isAuth: req.session.isLoggedIn
        });
    })
}