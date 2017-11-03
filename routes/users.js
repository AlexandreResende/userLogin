
const express = require('express');
const multer = require('multer');

const router = express.Router();
const upload = multer({dest: './uploads'});

const User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');

});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.post('/register', upload.single('profileimage'), function(req, res, next) {
  
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;
  let filename;

  if (req.file) {
    console.log(req.file);
    filename = req.file.filename;
  } else {
    console.log('No file');
    filename = 'noimage.jpg';
  }

  //form validation
  req.checkBody('name', 'Name field is required.').notEmpty();
  req.checkBody('email', 'Email field is required.').notEmpty();
  req.checkBody('email', 'Email should be validi.').isEmail();
  req.checkBody('username', 'Username is require.').notEmpty();
  req.checkBody('password', 'Password field is required.').notEmpty();
  req.checkBody('password2', 'Password2 does not match.').equals(req.body.password);

  //check errors
  var errors = req.validationErrors();

  if (errors) {
    console.log(errors);
    res.render('register', {errors});
  } else {
    console.log('No errors');
    var newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password,
      profileimage: req.file
    });

    User.createUser(newUser, (err, user) => {
      if (err) {
        throw err;
      }
      console.log(user);
    });

    res.location('/');
    res.redirect('/');
  }

});

module.exports = router;
