const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/signup', (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash,
    });
    user
      .save()
      .then(result => {
        res.status(201).json({
          message: 'User created!',
          result: result,
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err,
        });
      });
  });
});

router.post('/login', (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: 'Auth failed!',
        });
      }
      return bcrypt
        .compare(req.body.password, user.password)
        .then(result => {
          if (!result) {
            return res.status(401).json({
              message: 'Auth failed!',
            });
          }
          const token = jwt.sign(
            { email: user.email, userId: user._id },
            'kobe_bryant_is_the_greatest_basketball_player_of_all_time',
            { expiresIn: '1h' },
          );
          // you do NOT want to send password back
          // ...to user, even if it's hashed
          res.status(200).json({
            token: token,
          });
        })
        .catch(err => {
          return res.status(401).json({
            message: 'Auth failed!',
          });
        });
    })
    .catch(err => {
      return res.status(401).json({
        message: 'Auth failed!',
      });
    });
});

module.exports = router;
