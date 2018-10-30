const Post = require('../models/Post');
const User = require('../models/User');
const async = require('async');

let imgPath = [];
module.exports.post = (req, res, next) => {
    var bodyPost = req.body.bodyPost;
    var img = req.file;

    var userData = {
        userID: req.user.uid,
        username: req.user.username
    }

    console.log(req.user);
    async.waterfall([
        (callback) => {
            var newPost = new Post();
            newPost.body = bodyPost;
            newPost.image = img.filename;
            newPost.owner = userData;
            newPost.save((err, data) => {
                if(err) res.send('Something Error :(');
                if(data) callback(null, data);
            });
        },
        (data, callback) => {
            User.findOneAndUpdate({_id: req.user.uid},
            {
                $push: {
                    posts: {
                        post: data._id,
                        bodyPost: data.body,
                        image: data.image
                    }
                },
            },
                (err, user) => {
                    if (err) res.send(err)
                    if (user) res.redirect('/home');
                }
            );
        }
    ]);

}

module.exports.commentPost = (req, res, next) => {
    var idpost = req.params.idpost;
    Post.findById({_id: idpost}, (err, data) => {
        if(err) res.status(500).send(err);
        res.render('post/comment', {user: req.user.username, id: req.user.uid, dataPost: data});
    })
}

module.exports.comment = (req,res, next) => {
    var bodyComment = req.body.bodyComment;
    var id = req.body.id
    return new Promise((resolve, reject) => {
        Post.findById({_id: id}, (err, data) => {
            if(err) reject(err);
            if(data) resolve(data);
            return resolve();
        }).then((data) => {
            data.comment.push({
                userID: req.user.uid,
                username: req.user.username,
                bodyComment: bodyComment
            });
            data.save((err) => {
                if(err) res.send(err);
                if(data) res.redirect('/home');
            });
        }).catch((err) => next(err));
    })
}

module.exports.like = (req, res, next) => {
    return new Promise((resovle, reject) => {
        var postID = req.body.id;
        Post.findById({_id: postID}).then(data => {
            var likePost = data.likes.indexOf(req.user.uid);

            if(likePost == -1) {
                User.findById({_id: data.owner.userID}).then(user => {
                    user.likes = user.likes + 1;
                    user.save((err, log) => {
                        if(err) res.send(err);
                        if(log) {
                            data.likes.push(req.user.uid);
                            data.save((err, data) => {
                                if(err) res.send(err);
                                if(data) console.log(data);
                            })
                        }
                    });
                }).catch(err => next(err));
            }
        });
    });
}