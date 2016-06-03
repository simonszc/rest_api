'use strict';

const jwt = require('jsonwebtoken');
const User = require('../schema/user');
const secret = process.env.SECRET || 'changeme';

module.exports = function(req, res, next) {
  let token = req.body.token || req.headers.token;
  let tokenErr = new Error('Authorization Failure');
  let decodedToken;

  if(!token) return next(tokenErr);

  try {
    decodedToken = jwt.verify(token, secret);
  } catch(e) {
    return next(tokenErr);
  }

  User.findOne({_id:decodedToken}, (err, user) => {
    if(!user || err) return next(tokenErr);
    req.user = user;
    next();
  });
};
