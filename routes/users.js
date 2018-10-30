var express = require('express');
var router = express.Router();

const Post = require('../models/Post');
const User = require('../models/User');

const checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
}

router.get('/home', checkAuthenticated, (req, res, next) => {
    Post.find((err, post) => {
        if (err) res.send(err);
        res.render('user/home', {user: req.user.username, id: req.user.uid, posts: post});
    }).sort({date: -1}).exec((err) => {
        if(err) res.send(err)
    });
});

router.get('/profile/:id', checkAuthenticated, (req, res, next) => {
    // User.findOne({_id: req.params.id}).then((data) => {
    //     res.render('user/profile', {
    //         user: req.user.username, 
    //         id: req.user.uid, 
    //         users: data
    //     });
    // }).catch((err) => next(err));

    return new Promise((resolve, reject) => {
        var userID = req.params.id;
        console.log(userID);

        User.findOne({_id: userID}, (err, data) => {
            if(err) reject(err);
            if(data) resolve(data);
            return resolve();
        }).then((data) => {
            res.render('user/profile', {user: req.user.username, id: req.user.uid, users: data});
        }).catch(err => next(err));
    });
});

module.exports = router;
