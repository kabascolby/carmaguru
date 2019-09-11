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

exports.postUserLoginPage = (req, res, next) => { //working here
    let user = req.body;
    UserDb.fetchAll()
        .then(data => {

        })


    //TODO security and cookies checking has to be applicate here before redirection
    console.log(userInfos)
    if (Object.keys(user).length &&
        Object.keys(userInfos).length &&
        (userInfos.hasOwnProperty(user.username)) &&
        (user.psw === userInfos[user.username].psw)) {
        res.redirect('/');
    } else
        res.send('Invalide User credential');

};


// signin Logic implementation

exports.getUserRegistration = (req, res, next) => {
    res.render('signIn', {
        pageTitle: 'SignIn',
        pagePath: '/api/singIn/'
    })
};

exports.postUserRegistration = (req, res, next) => {
    let form = req.body;
    formValidation(form);
    const userDb = new UserDb(form);
    //TODO CHECK IF USERNAME ALREADY EXIST
    userDb.save().catch(e => console.error(e, 'Error on Post user form'));
    res.redirect('/api/login');
};

//TODO FIX THIS DOESN NEED THIS PART
// exports.userDb = UserDb;