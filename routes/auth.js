const express = require('express');

const authController = require('../controllers/auth');

const isAuth = require('../middleware/is-auth');

const {check} = require('express-validator/check');
const User = require('../models/user');

const router = express.Router();
router.get('/signup',authController.getSignUp,);

router.get('/login',authController.getLogin);

router.post('/signup',
    [
        check('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .custom((value, { req }) => {
            return User.findOne({email: value}).then(userDoc =>{
                if(userDoc){
                    return Promise.reject(
                        'E-mail already exist, please pick a different one.'
                    );
                }
            })
        })
        .normalizeEmail(),
        check('password', 'Enter a valid password.')
        .isAlphanumeric()
        .isLength({min: 8})
        .trim(),
        check('confirmPassword').trim().custom((value, {req})=> {
            if(value !== req.body.password){
                throw new Error('Password has to match!');
            }
            return true;
        })
    ],
    authController.postSignUp);

router.post('/login',
    [
        check('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .normalizeEmail(),
        check('password', 'Password has to be valid.')
        .isLength({min: 8})
        .isAlphanumeric()
        .trim()
    ],
    authController.postLogin);

router.post('/logout',isAuth, authController.postLogout);

module.exports = router;

