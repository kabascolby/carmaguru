// const path = require('path');
const express = require('express');
const bodyparser = require('body-parser');

const db = require('./utility/database');

const PORT = 8080;
const app = express();

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

// db.execute(' SELECT *, BIN_TO_UUID(id) id FROM users').then(data => console.log(data[0]));
// db.execute('SHOW tables').then(data => console.log(data[0]));
app.set('view engine', 'ejs')
app.set('views', 'views/ejs')

app.use(express.static('public'))

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