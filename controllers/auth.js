const User = require('../models/user');
const bcrypt = require('bcryptjs');

const {validationResult} = require('express-validator/check');

exports.getSignUp = (req, res, next) => {
    res.render('auth/signUp',{
        pageTitle: 'SignUp',
        path: '/signUp',
        errorMessage: '',
        isAuthenticated: false
    })
}

exports.getLogin = (req, res, next) => {
    res.render('auth/login',{
        pageTitle: 'Login',
        path: '/login',
        isAuthenticated: false,
        errorMessage: '',
        validationErrors: []
    })
}

exports.postSignUp = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);
    console.log(errors);
    if(!errors.isEmpty()){
        return res.status(422).render('auth/signup',{
            pageTitle: 'SignUp',
            path: '/signUp',
            isAuthenticated: false,
            errorMessage: errors.array()[0].msg
        })
    }

    bcrypt.hash(password,12)
    .then(hashedPassword => {
        const user = new User({
            email: email,
            password: hashedPassword
        })
        return user.save();
    })
    .then(results => {
        res.redirect('/login');
    })
    .catch(err => {
        console.log(err);
    })
}

exports.postLogin =(req, res, next) =>{
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).render('auth/login',{
            pageTitle: 'Login',
            path: '/login',
            isAuthenticated: false,
            errorMessage: errors.array()[0].msg
        })
    }

    User.findOne({email: email})
    .then(user => {
        if(!user){
            return res.status(422).render('auth/login',{
                pageTitle: 'Login',
                path: '/login',
                isAuthenticated: false,
                errorMessage: 'Invalid User'
            })
        }
        bcrypt.compare(password, user.password)
        .then(doMatch => {
            if(doMatch){
                req.session.isLoggedin = true;
                req.session.user = user;
                return req.session.save(err => {
                    console.log(err);
                    res.redirect('/');
                })
            }
            return res.status(422).render('auth/login', {
                path: '/login',
                pageTitle: 'Login',
                errorMessage: 'Invalid password.'
              });
        })
        .catch(err => {
            console.log(err);
        })
    })
    .catch(err => {
        console.log(err);
    })
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    })
}