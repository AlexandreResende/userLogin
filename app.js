const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require("passport-local").Strategy;
const multer = require('multer');
const upload = multer({dest: './uploads'});
const flash = require('connect-flash');
const expressValidator = require('express-validator');
const bcrypt = require('bcryptjs');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const db = mongoose.conection;

const User = require('./models/user');

const index = require('./routes/index');
const users = require('./routes/users');

const app = express();

// view engine setup
app
.set('views', path.join(__dirname, 'views'))
.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app
.use(logger('dev'))
.use(bodyParser.json())
.use(bodyParser.urlencoded({ extended: false }))
.use(cookieParser())
.use(express.static(path.join(__dirname, 'public')))
.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}))
.use(passport.initialize())
.use(passport.session())
.use(expressValidator())
.use(require('connect-flash')())
.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
})
.use('/', index)
.use('/users', users)
.use(function(req, res, next) {// catch 404 and forward to error handler
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
})
.use(function(err, req, res, next) {// error handler
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
