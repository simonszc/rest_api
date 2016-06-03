'use strict';

const mongoose = require('mongoose');

const Venue = new mongoose.Schema({
  name: String,
  neighborhood: String,
  servesAlcohol: Boolean
});

module.exports = mongoose.model('venue', Venue);
