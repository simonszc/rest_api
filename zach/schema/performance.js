//performance schema

'use strict';

const mongoose = require('mongoose');

const Performance = mongoose.Schema({
  name: String,
  startDate: Date,
  endDate: Date,
  venue: String,
  venueObject: Object
});

module.exports = mongoose.model('performance', Performance);
