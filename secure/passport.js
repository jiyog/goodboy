const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(new localStrategy((username, password, done) => {
    User.findOne({username: username}, (err, doc) => {
        if (err) {
            done(err);
        } else {
            if (doc) {
                var valid = doc.comparePassword(password, doc.password);
                if (valid) {
                    done(null, {
                        username: doc.username,
                        password: doc.password,
                        uid: doc._id
                    });
                } else {
                    done(null, false);
                }
            } else {
                done(null, false);
            }
        }
    })
}));