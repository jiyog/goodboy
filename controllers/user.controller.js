const User = require('../models/User');
module.exports.loginPage = (req, res, next) => {
    res.render('login', {messenger: req.flash('err')});
}

module.exports.registerPage = (req, res, next) => {
    res.render('register', {messenger: req.flash('err')});
}

module.exports.register = (req, res, next) => {
    var username = req.body.username;
    var password = req.body.password;
    
    User.findOne({username: username}, (err, doc) => {
        if (err) {
            res.status(500).send('error occured');
        } else {
            if (doc) {
                res.flash('err', 'Username already exists');
            } else {
                var recordUser = new User();
                recordUser.username = username;
                recordUser.password = recordUser.hashPassword(password);
                recordUser.save((err, user) => {
                    if (err) {
                        res.status(500).send('Database is error');
                    } else {
                        req.session.uid = user._id;
                        req.session.username = user.username;
                        res.redirect('/login');
                    }
                });
            }
        }
    });
}

module.exports.logout = (req, res, next) => {
    if (req.session) {
        req.logout();
        res.redirect('/');
    } else {
        res.redirect('/');
    }
}