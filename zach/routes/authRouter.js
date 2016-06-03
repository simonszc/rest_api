'use strict';

const express = require('express');
const bodyParser = require('body-parser').json();
const User = require('../schema/user');
const basicHTTP = require('../lib/basic_http');

const router = module.exports = exports = express.Router();

router.post('/signup', bodyParser, (req, res, next) => {
  let newUser = new User(req.body);
  let hashedPassword = newUser.hashPassword();
  newUser.password = hashedPassword;
  req.body.password = null;
  User.findOne({username: req.body.username}, (err, user) => {
    if (err || user) return next(new Error('could not create user. do they already exist?'));
    newUser.save((err, newUser) => {
      if(err) return next(new Error('could not create user'));
      res.json({token: newUser.generateToken()});
    });
  });
});

router.get('/signin', basicHTTP, (req, res, next) => {
  User.findOne({username: req.auth.username}, (err, user) => {
    if(err || !user) return next(new Error('could not sign in. does user exist?'));
    if(!user.comparePassword(req.auth.password)) return next(new Error('could not sign in. is this the correct password?'));
    res.json({token: user.generateToken()});
  });
});
