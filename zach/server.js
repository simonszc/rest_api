'use strict';

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const errorHandler = require('./lib/error_handling.js');

const dbPort =process.env.MONGOLAB_URI || 'mongodb://localhost/dev_db';

mongoose.connect(dbPort);

const venRouter = require('./routes/venRouter');

app.use('/venues', venRouter);

const perfRouter = require('./routes/perfRouter');

app.use('/performances', perfRouter);


app.listen(3000, () => {
  console.log('up on 3000')
});

module.exports = app;
