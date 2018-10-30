const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const flash = require('connect-flash');

const session = require('express-session');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/goodboy', {useNewUrlParser: true});

const bodyParser = require('body-parser');
const passport = require('passport');
require('./secure/passport.js');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const postRouter = require('./routes/post');

const app = express();

app.use(flash());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/uploads', express.static('uploads'));
app.use('/stylesheets', express.static('stylesheets'));
app.use('/javascripts', express.static('javascripts'));

app.use(session({
  secret: 'thisiscode',
  cookie: { maxAge: 180000 },
  saveUninitialized: true,
  resave: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/', postRouter);
// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
