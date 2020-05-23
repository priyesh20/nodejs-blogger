const express = require('express');

const blogsController = require('../controllers/blogs');

const router = express.Router();

router.get('/',blogsController.getIndex);

router.post('/upVote/:blogId',blogsController.postUpVote);

module.exports = router;