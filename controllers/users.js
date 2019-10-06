const bcrypt = require('bcryptjs');
const UserDb = require('../models/usersDb');
const TokenDb = require('../models/tokenDb');
const sgMail = require('../utility/mail');
const crypto = require('crypto');

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
                req.flash('error', 'Invalide User credentials');
                res.redirect('/api/login');
            }
        })) /* Returning the users of comparing a password  which is a promesses*/
        .catch(() => {
            console.error(new Error('Invalide User'));
            req.flash('error', 'Invalide User credentials');
            res.redirect('/api/login');
        });
};


// signin Logic implementation

exports.getUserRegistration = (req, res, next) => {
    res.render('signIn', {
        pageTitle: 'SignIn',
        pagePath: '/api/singIn/',
        // errorMessage: req.flash('error')
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
                req.flash('error', 'Username already taken please try another one');
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

                    const msg = {
                        to: form.email,
                        from: 'info@camagru.com',
                        subject: 'Signup succesfull',
                        text: 'and easy to do anywhere, even with Node.js',
                        html: `<h2>Hi ${form.first}  ${form.last} You're on your way!</h2>
						<h3>Welcom to IDID made by Lamine Kaba</h3>
						<p>You successfully signed up!</p>
						<p>Singin and upload your images</p>`,
                    };
                    sgMail.send(msg, (err) => {
                        if (err)
                            console.error('error --------------->', err)
                    });
                })
        })
        .catch(e => {
            console.error(e);
            req.flash('error', 'Invalid data format');
            return res.redirect('/api/signIn');
        });
};

/* 
	Setting up action when a user hit Logout 
	by deleting the session coockie in the DB
*/
exports.getLogout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) console.error(err);
        res.redirect('/');
    })
}


/* ------------------------------------------------- Reset user Password ------------------------------------------------ */

exports.getReset = (req, res, next) => {
    res.render('reset', {
        pageTitle: 'Reset Password',
        pagePath: '/api/reset/',
    })
}


exports.postReset = (req, res, next) => {
    const email = req.body.email;
    const username = req.body.username;
    var userInfos;
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.error(new Error('Error getting the token', err));
            return res.redirect('/api/reset')
        }
        const token = buffer.toString('hex');
        UserDb.fetchUser(username)
            .then(([
                [user]
            ]) => {
                if (!user || user.email !== email) {
                    req.flash('error', 'Invalide User credentials');
                    res.redirect('/api/reset');
                }

                userInfos = user;
                const tokenDb = new TokenDb(token, user.id);
                return tokenDb.save()
            })
            .then(([users]) => {
                if (users.warningStatus) {
                    console.error(new Error('Insertion in the DB FAIL', e));
                    res.redirect('/api/reset');
                }

                res.redirect('/api/login');
                const msg = {
                    to: email,
                    from: 'info@camagru.com',
                    subject: 'Password reset',
                    html: `<h2>Hi ${userInfos.firstname}  ${userInfos.lastname}</h2>
                	<h3>You requested a password reset</h3>
                	<p>Click this <a href="http://localhost:8080/api/reset/${token}</a> to set a new password</p>
                	<p>Singin and upload your images</p>`,
                };

                sgMail.send(msg, (err) => {
                    if (err)
                        console.error('error email reset--------------->', err)
                });

            })
            .catch((e) => {
                console.error(new Error('Error retriving user data', e));
                req.flash('error', 'Server Error please try later');
                res.redirect('/api/reset');
            });
    })
}

/* ______________________________________________________________________________________________________________________ */



/* ------------------------------------------------- Reset user Password ----------------------------------------------- */

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    TokenDb.fetchUserToken(token)
        .then(([
            [user]
        ]) => {
            if (!user) {
                req.flash('error', '😞Invalide request or Request Expire');
                return res.redirect('/api/login');
            }
            res.render('new-password', {
                pageTitle: 'Update password',
                pagePath: '/api/new-password',
                userId: user.id,
                token: user.token
            })
        })
        .catch(e => console.error(e));
}




exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const token = req.body.token;
    TokenDb.fetchUserAndToken(token, userId)
        .then(([
            [user]
        ]) => {
            if (!user) {
                req.flash('error', '😞Request Expire get a new link');
                return res.redirect('/api/reset');
            }
            return bcrypt.hash(newPassword, 12)
        })
        .then(hashedPsw => {
            return UserDb.updatePassword(userId, hashedPsw);
        })
        .then(([result]) => {
            if (result.warningStatus !== 0) {
                req.flash('error', '😞Server error try later');
                return res.redirect('/api/reset/' + token);
            }
            res.redirect('/api/login');
            TokenDb.destroy(token);
        })
        .catch(e => console.error(e));
}

/* ______________________________________________________________________________________________________________________ */

/* ------------------------------------------------- User Settings ----------------------------------------------- */

exports.getUserSettings = (req, res, next) => {
    const userId = req.session.userId;
    UserDb.fetchByUserId(userId)
        .then(([
            [userData]
        ]) => {
            if (!userData) {
                req.flash('error', 'Invalide informations');
                return res.redirect('/settings');
            }
            res.render('settings', {
                pageTitle: 'settings',
                pagePath: '/settings',
                user: userData
                    // errorMessage: req.flash('error')
            })
        })
        .catch(e => {
            console.log('Error on setting controller\n', e);
            req.flash('error', 'Server Error please try later');
            res.redirect('/settings');
        });
};

exports.postUserSettings = (req, res, next) => {
    const userId = req.session.userId;
    let pass;
    UserDb.fetchByUserId(userId)
        .then(([
            [result]
        ]) => {
            if (!result) {
                req.flash('error', 'Invalide informations retry');
                return res.redirect('/settings');
            }
            const { first, last, username, email, password } = req.body;
            if (!first || !first.length || !last || !last.length ||
                !username || !username.length || !email || !email.length) {
                req.flash('error', 'Empty field');
                return res.redirect('/settings');
            }
            pass = password;

            return UserDb.updateCredentials(first, last, username, email, userId);
        })
        .then(([result]) => {
            if (result.warningStatus !== 0) {
                req.flash('error', '😞Server error try later');
                return res.redirect('/settings');
            }

            if (pass && pass.length) {
                bcrypt.hash(pass, 12)
                    .then(hashedPsw => {
                        return UserDb.updatePassword(userId, hashedPsw);
                    })
                    .then(([result]) => {
                        if (result.warningStatus !== 0) {
                            req.flash('error', '😞Server error try later');
                            return res.redirect('/settings');
                        }
                        res.redirect('/api/login');
                    })
                    .catch(e => {
                        console.error('error insertion password\n', e);
                        req.flash('error', '😞Server error try later');
                        return res.redirect('/settings');
                    });

            } else {
                res.redirect('/api/login');
            }
        })
        .catch(e => {
            console.log('Error on setting controller\n', e);
            req.flash('error', 'Server Error please try later');
            return res.redirect('/settings');
        });
}


/* ______________________________________________________________________________________________________________________ */