const Blog = require('../models/blogs');

exports.getAddBlog = (req, res, next) => {
    res.render('admin/add-blog',{
        pageTitle: 'addBlog',
        path: '/admin/add-Blog',
        editing: false,
        isAuthenticated: req.session.isLoggedin
    })
}

exports.getMyBlogs = (req, res, next) => {
    Blog.find({userId: req.user._id}).then(blogs => {
        res.render('admin/blogs',{
            blogs: blogs,
            pageTitle: 'Your Blogs',
            path: '/admin/blogs',
            isAuthenticated: req.session.isLoggedin
        })
    })
    .catch(err => {
        console.log(err);
    });
}

exports.postAddBlog = (req, res, next) => {
    const title = req.body.title;
    const description = req.body.description;
    const userId = req.session.user._id;
    let upVote = 0;
    const blog = new Blog({
        title: title,
        description: description,
        userId: userId,
        upVote: upVote,
        upVoters: {upVotersInfo:[]}
    });
    blog
        .save()
        .then(result => {
            console.log('Created Blog');
            res.redirect('blogs');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getEditBlog = (req, res, next) => {
    const editMode = req.query.edit;
    if(!editMode){
        res.redirect('/');
    }
    const blogId = req.params.blogId;
    Blog.findById(blogId)
        .then(blog => {
            if(!blog){
                res.redirect('/');
            }
            res.render('admin/add-blog',{
                pageTitle: 'Edit Blog',
                path: '/admin/edit-blog',
                editing: editMode,
                blog: blog,
                isAuthenticated: req.session.isLoggedin
            })
        })
        .catch(err => {
            console.log(err);
    })
}

exports.postEditBlog = (req, res, next) => {
    const title = req.body.title;
    const description = req.body.description;
    const blogId = req.body.blogId;

    Blog.findById(blogId)
    .then(blog => {
        blog.title = title;
        blog.description = description;
        return blog.save().then(result => {
            console.log('product Updated');
            res.redirect('/admin/blogs');
        })
    })
    .catch(err => {
        console.log(err);
    });
}