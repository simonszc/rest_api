//performance routes
'use strict';

const express = require('express');
const bodyParser = require('body-parser').json();
const Performance = require('./../schema/performance');
const Venue = require('./../schema/venue');
const jwtAuth = require('./../lib/jwt_auth');

const router = module.exports = exports = express.Router();

router.get('/', (req, res, next) => {
  Performance.find({}, (err, performances) => {
    if(err) return next(err);
    res.json(performances);
  });
});

router.post('/', bodyParser, jwtAuth, (req, res, next) => {
  let venueName = req.body.venue;
  let venueObject;
  Venue.find({name: venueName}, (err, venue) => {
    if(err) return next(err);
    venueObject = venue;
    req.body.venueObject = venueObject;
    let newPerformance = new Performance(req.body);
    newPerformance.save((err, performance) => {
      if(err) next(err);
      res.json(performance);
    });
  });
});

router.put('/', bodyParser, jwtAuth, (req, res, next) => {
  let putName = req.body.name;
  Performance.findOneAndUpdate({name: putName}, req.body, (err, data) => {
    if (err) return next(err);
    let message = data.name + ' successfully updated';
    res.json({message});
  });
});

router.delete('/:name', bodyParser, jwtAuth, (req, res, next) => {
  let name = req.params.name;
  Performance.findOneAndRemove({name}, (err, performance) => {
    if(err) return next(err);
    let message = performance.name + ' successfully deleted';
    res.json({message});
  });
});
