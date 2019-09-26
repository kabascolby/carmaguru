const bcrypt = require('bcryptjs');
const UserDb = require('../models/usersDb');

/*
 ** Because the login and the signing API belong to user that why 
 ** Im grouping the controller logic in users controllers file
 */


function formValidation(form) {
    //check proprities to avoid breaking the code
    ['first', 'last', 'email', 'psw', 'username'].forEach(el => {
        if (form.hasOwnProperty(el) === false)
            console.error(new Error('Invalide form'));
    })
}

// loging logic implementation

exports.getUserLoginPage = (req, res, next) => {
    // console.log(req.get('Cookie'));
    res.render('login', {
        pageTitle: 'Login',
        pagePath: '/api/login',
    });
};

exports.postUserLoginPage = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.psw;
    UserDb.fetchUser(username)
        .then(([
            [data]
        ]) => bcrypt.compare(password, data.password).then(match => {
            if (match) {
                req.session.userId = data.id;
                req.session.isLoggedIn = true
                    /* Making sure the session is saved before redirection */
                req.session.save(err => {
                    if (err) console.error(err);
                    res.redirect('/');
                })
            } else {
                res.redirect('/api/login');
            }
        })) /* Returning the result of comparing a password  which is a promesse*/
        .catch(() => {
            console.error(new Error('Invalide User'));
            res.redirect('/api/login');
        });
};


// signin Logic implementation

exports.getUserRegistration = (req, res, next) => {
    res.render('signIn', {
        pageTitle: 'SignIn',
        pagePath: '/api/singIn/',
    })
};

exports.postUserRegistration = (req, res, next) => {
    let form = req.body;
    formValidation(form);
    /* Checking if the user already exist */
    UserDb.fetchUser(form.username)
        .then(([
            [user]
        ]) => {
            /* if there is an availaible user return to Signup page again */
            if (user) {
                console.error(new Error('User already exit\n'))
                return res.redirect('/api/signIn');
            }

            /* Encrypting password with salt bcrypt is promesse so I return to make sure it's done */
            return bcrypt.hash(form.psw, 12)
                .then(hashedPsw => {
                    form.psw = hashedPsw;
                    const userDb = new UserDb(form);
                    /* Saving user credential in the database */
                    return userDb.save();
                })
                .then(() => {
                    res.redirect('/api/login');
                })
        })
        .catch(e => {
            console.error(e);
        });
};

/* Setting up action when a user hit Logout 
	by deleting the session coockie in the DB
 */
exports.getLogout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) console.error(err);
        res.redirect('/');
    })
}

//TODO FIX THIS DOESN NEED THIS PART
// exports.userDb = UserDb;