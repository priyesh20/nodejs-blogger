const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const mongoDbStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const path = require('path');

const csrf = require('csurf');
const User = require('./models/user');

const MONGODB_URI = 'mongodb+srv://<username>:<password>@cluster0-xeqse.mongodb.net/bloggers';

const app = express();
const store = new mongoDbStore({
    uri: MONGODB_URI,
    collection: 'session'
})
const csrfProtection = csrf(); 

app.set('view engine', 'ejs');
app.set('views','views');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const blogsRoutes = require('./routes/blogs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret: 'my secret',resave: false, saveUninitialized: false, store: store}));
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    if(!req.session.user){
        return next();
    }
    User.findById(req.session.user._id)
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err => {
        console.log(err);
    })
});

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedin;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use('/admin',adminRoutes);
app.use(blogsRoutes);
app.use(authRoutes);

mongoose.connect(MONGODB_URI).then(result => {
    app.listen(3100);
}).catch(err => {
    console.log(err);
})
