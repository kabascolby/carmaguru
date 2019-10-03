// const path = require('path');
const express = require('express');
const bodyparser = require('body-parser');
const session = require('express-session');
/*
Calling expression session Module to save user informations in a Db
https://www.npmjs.com/package/express-mysql-session
*/
const MySQLStore = require('express-mysql-session')(session);

/*
sending temporary message to the frontend to display information to users
*/
const flash = require('connect-flash');

const db = require('./utility/database');

const app = express();

const { PORT } = require('./utility/config');


const options = require('./utility/options');
//ToDO export this Later




const sessionStore = new MySQLStore(options);
/* _____________________________________________________________________________ */

const mainRoute = require('./routes/index');
const userRoute = require('./routes/users');
const loginRoute = require('./routes/login');
const registerRoute = require('./routes/register');
const galleryRoute = require('./routes/gallery');
const imagesRoute = require('./routes/images');
const adminRoute = require('./routes/admin');
const errorController = require('./controllers/error');
const creation = require('./utility/schema');
app.use(bodyparser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyparser.json({ limit: '50mb', extended: true }));


app.set('view engine', 'ejs');
app.set('views', 'views/ejs');

app.use(express.static('public'));

/* 
	Storing users sessin in the DB by using session middleaware
	_____________________________________________________________________________
*/
app.use(session({
    secret: 'this will not be availaible later',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));
/* _____________________________________________________________________________ */


/*
	creating the falsh message middleware;
	_____________________________________________________________________________
 */

app.use(flash());
/* _____________________________________________________________________________ */


/* adding a Data availaible in all the views
	creating a middleware
	_____________________________________________________________________________
*/
app.use((req, res, next) => {
    res.locals.isAuth = req.session.isLoggedIn;
    res.locals.errorMessage = req.flash('error');
    next();
});

/* _____________________________________________________________________________ */
app.use(mainRoute);
app.use(userRoute);
app.use('/api/', adminRoute);
app.use('/api/', loginRoute);
app.use('/api/', registerRoute);
app.use(galleryRoute);
app.use(imagesRoute);
// app.use(creation)

app.use(errorController.get404);

const server = app.listen(PORT, (err) => {
    if (err) console.log(err);
    console.log('Server running on http://localhost:' + PORT);
})

server.keepAliveTimeout = 0;