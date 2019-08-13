const express = require('express');

const mainPath = require('../utility/path');
const userData = require('./signIn');

const router = express.Router();

router.get('/login', (req, res, next) => {
    res.render('login', {
        pageTitle: 'Login',
        pagePath: '/api/login'
    });
});

router.post('/login', (req, res, next) => {
    let user = req.body;
    let credential = userData.users;
    //security and cookies checking has to be applicate here before redirection
    // console.log('-------------------------->', credential);
    // console.log(req.body);

    if ((user.username === credential[user.username].username) &&
        (user.psw === credential[user.username].psw)) {
        res.redirect('/');
    } else
        res.send('Invalide User credential');
})


/* [ kabascolby: { first: 'Lamine',
last: 'Kaba',
username: 'kabascolby',
email: 'brianbixby0@gmail.com',
psw: 'foodfood',
submit: 'Register' } ] */
module.exports = router;