// const path = require('path');
const express = require('express');

const mainPath = require('../utility/path');

const router = express.Router();
const users = [];

router.get('/signIn', (req, res, next) => {
    res.render('signIn', {
        pageTitle: 'SignIn',
        pagePath: '/api/singIn/'
    })
});

router.post('/signIn', (req, res, next) => {
    let user = req.body;
    // users.push(user.username);
    users[user.username] = user;
    console.log(users);
    res.redirect('/api/login');
})

module.exports = {
    router,
    users
}