const Blog = require('../models/blogs');

exports.getIndex = (req, res, next) =>{
    Blog
        .find()
        .then(blogs => {
            res.render('blog/index', {
                pageTitle: 'Blogs',
                path: '/',
                blogs: blogs,
                isAuthenticated: req.session.isLoggedin,
                // csrfToken: req.csrfToken()
            })
        })
        .catch(err => {
        console.log(err);
    });
}

exports.postUpVote = (req, res, next) => {
    const blogId = req.params.blogId; 
    let upVoteCount;
    Blog.findOne({_id: blogId}).then(b => {
        return Blog.upVoteCal(b, req.user._id);    
    })
    .then(result =>{
        upVoteCount = result.upVote;
        res.status(200).json({message: 'Success!', upVoteCount: upVoteCount});
    })
    .catch(err => {
        console.log(err);
    })
}

