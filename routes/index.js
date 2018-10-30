var express = require('express');
var router = express.Router();
var userController = require('../controllers/user.controller');
const passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', userController.loginPage);
router.get('/register', userController.registerPage);

router.post('/register', userController.register);
router.post('/login', passport.authenticate('local', {failureRedirect: '/login', successRedirect:'/home', failureFlash: true}), (req, res) => {
  res.send('Hey');
});

router.get('/logout', userController.logout);
module.exports = router;
