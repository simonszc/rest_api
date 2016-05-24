'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const fs = require('fs');

const venRouter = express.Router();

app.use(jsonParser);
app.use('/venues', venRouter);

venRouter.get('/', (req, res) => {
  fs.readdir(__dirname + '/../data', (err, files) => {
    res.send(files.join(', ') + '\n');
  })
})

venRouter.get('/:id', (req, res) => {
  let id = req.params.id;
  fs.readFile(__dirname + '/../data/' + id + '.json', (err, data) => {
    if(err) throw err;
    let output = JSON.parse(data.toString());
    res.json(output);
  })
})

venRouter.post('/', (req, res) => {
  let input = req.body;
  fs.readdir(__dirname + '/../data', (error, files) => {
    if(error) throw err;
    fs.writeFile(__dirname + '/../data/' + input.venue + '.json', JSON.stringify(input), (err) => {
      if(err) throw err;
      res.send('saved ' + input.venue + '!');
    })
  })
})

venRouter.put('/:id', (req, res) => {
  let id = req.params.id;
  let input = req.body;
  fs.writeFile(__dirname + '/../data/' + id + '.json', JSON.stringify(input), (err) => {
    if(err) throw err;
    res.send('rewrote ' + input.venue);
  });
})

venRouter.delete('/:id', (req, res) => {
  let id = req.params.id;
  fs.unlink(__dirname + '/../data/' + id + '.json', () => {
    res.send('deleted ' + id + ' from data');
  })
})





app.listen(3000, () => {
  console.log('up on 3000')
});

module.exports = app;
