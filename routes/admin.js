const express = require('express');

const adminController = require('../controllers/admin');

const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/add-Blog', isAuth, adminController.getAddBlog);

router.get('/blogs',isAuth, adminController.getMyBlogs);

router.get('/edit-blog/:blogId',isAuth ,adminController.getEditBlog);

router.post('/add-blog',isAuth, adminController.postAddBlog);

router.post('/edit-blog',isAuth, adminController.postEditBlog);

module.exports = router;