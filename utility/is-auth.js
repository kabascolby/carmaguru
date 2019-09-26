module.exports.isOn = (req, res, next) => {
    /* implementing route protection to redirect the user if is already loggedin */
    if (req.session.isLoggedIn)
        return res.redirect('/');
    next();
}

module.exports.isOff = (req, res, next) => {
    /* implementing route protection to redirect the user if is already loggedin */
    if (req.session.isLoggedIn)
        return res.redirect('/api/login');
    next();
}