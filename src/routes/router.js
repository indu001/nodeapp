const express = require('express');
const router = express.Router();
const User = require('../models/user')
const path = require('path');


router.get('/', (req, res, next) => {
  return res.sendFile(path.join(__dirname + '/../index.html'));
});

router.post('/', (req, res, next) => {

  // check if password re-entered match
  if (req.body.password !== req.body.passwordConf) {
    const err = new Error('Passwords do not match');
    err.status = 400;
    res.send('Passwords do not match');
    return next(err);
  }

  // create new user
  if (req.body.email && req.body.username && req.body.password && req.body.passwordConf) {
    const userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      passwordConf: req.body.passwordConf
    };

    User.create(userData, (err, user) => {
      if (err) {
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });
  }
  else if (req.body.logemail && req.body.logpassword) {
    //login
    User.authenticate(req.body.logemail, req.body.logpassword, (err, user) => {
      if (err || !user) {
        const err = new Error('wrong credentials');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        // res.send('it worked');
        return res.redirect('/profile');
      }
    })

  } else {
    const err = new Error('All fields are mandatory');
    err.status = 400;
    return next(err);
  }
});

// profile 
router.get('/profile', function (req, res, next) {
  console.log('here');
  User.findById(req.session.userId)
    .exec((err, user) => {
      if (err) {
        return next(err);
      } else {
        if (user === null) {
          var err = new Error('Unauthorized');
          err.status = 400;
          return next(err);
        } else {
          return res.send('<h1>Name: </h1>' + user.username + '<h2>Mail: </h2>' + user.email + '<br><a type="button" href="/logout">Logout</a>')
        }
      }
    });
});

//logout
router.get('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});


module.exports = router;
