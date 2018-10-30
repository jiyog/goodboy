const express = require('express');
var router = express.Router();
const multer = require('multer');
const postController = require('../controllers/post.controller');

const checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
}

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/post')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

var upload = multer({
  storage: storage,
  fileFilter: function(req, file, cb) {
      var types = ['image/jpeg', 'image/png'];
      type = types.find(type => type == file.mimetype);

      if (!type) {
          return cb(null, false);
      }

      return cb(null, true);

  }
});

router.post('/post', upload.single('imagePost'), postController.post);

router.get('/comment/:idpost',checkAuthenticated, postController.commentPost);

router.post('/add-comment', postController.comment);

router.post('/like', postController.post);

module.exports = router;