const UserDb = require('../models/usersDb');

/*
 ** Because the login and the signing API belong to user that why 
 ** Im grouping the controller logic in users controllers file
 */


function formValidation(form) {
    //check proprities to avoid breaking the code
    ['first', 'last', 'email', 'psw', 'username'].forEach(el => {
        if (form.hasOwnProperty(el) === false)
            throw Error('Invalide form')
    })
}

// loging logic implementation

exports.getUserLoginPage = (req, res, next) => {
    res.render('login', {
        pageTitle: 'Login',
        pagePath: '/api/login'
    });
};

exports.postUserLoginPage = (req, res, next) => {
    const userDb = UserDb.fetchAll(data => {
        return data;
    });
    let user = req.body;

    //TODO security and cookies checking has to be applicate here before redirection


    if (Object.keys(user).length &&
        Object.keys(userDb).length &&
        (user.username === userDb[user.username].username) &&
        (user.psw === userDb[user.username].psw)) {
        res.redirect('/');
    } else
        res.send('Invalide User credential');
};


// signin Logic implementation

exports.getUserSigninPage = (req, res, next) => {
    res.render('signIn', {
        pageTitle: 'SignIn',
        pagePath: '/api/singIn/'
    })
};

exports.postUserSigninPage = (req, res, next) => {
    try {
        let form = req.body;
        formValidation(form);
        const userDb = new UserDb(form);
        userDb.save();
        res.redirect('/api/login');
    } catch {
        throw new Error('Error on Post user form');
    }
};

//TODO FIX THIS DOESN NEED THIS PART
// exports.userDb = UserDb;