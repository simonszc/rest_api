'use strict'
const express = require('express');
const bodyParser = require('body-parser').json();
const Venue = require('./../schema/venue');

const router = module.exports = exports = express.Router();

router.get('/', (req, res, next) => {
  Venue.find({}, (err, venues) => {
    if(err) return next(err);
    res.json(venues);
  });
});

router.post('/', bodyParser, (req, res, next) => {
  let newVenue = new Venue(req.body);
  newVenue.save((err, venue) => {
    if (err) return next(err);
    res.json(venue);
  });
});

router.put('/', bodyParser, (req, res, next) => {
  let _id = req.body._id;
  Venue.findOneAndUpdate({_id}, req.body, (err, venue) => {
    if (err) return next(err);
    let message = 'successfully updated';
    res.json({message});
  });
});

router.delete('/:id', (req, res, next) => {
  let _id = req.params.id;
  Venue.findOneAndRemove({_id}, (err, venue) => {
    if(err) return next(err);
    let message = 'successfully deleted';
    res.json({message});
  });
});
