'use strict';

const chai = require('chai');
const expect = require('chai').expect;
const chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
const fs = require('fs');
const server = require(__dirname + '/../lib/server.js');

describe('express server with basic persistence', () => {
  before((done) => {
    fs.readdir(__dirname + '/../data', (err, files) => {
      if(files.indexOf('testVenue.json') !== -1) {
        chai.request('http://localhost:3000')
          .delete('/venues/testVenue')
          .end((err, res) => {
            if(err) console.log(err);
            done();
          })
      }
    })
  })
  it('should write a new file to /data when we post', (done) => {
    fs.readdir(__dirname + '/../data', (err, files) => {
      let startFileLength = files.length;
      chai.request('http://localhost:3000')
        .post('/venues')
        .send({venue: 'testVenue'})
        .end((err, res) => {
          fs.readdir(__dirname + '/../data', (err, files) => {
            expect(files.length).to.eql(startFileLength + 1);
            done();
          })
        })
    })
  })
  it('should return a list of our files on /get', (done) => {
    fs.readdir(__dirname + '/../data', (err, files) => {
      chai.request('http://localhost:3000')
        .get('/venues')
        .end((err, res) => {
          expect(res.text).to.eql(files.join(', ') + '\n');
          done();
        })
      })
  })
  it('should return the object stored in our file on /get/:id', (done) => {
    chai.request('http://localhost:3000')
      .get('/venues/testVenue')
      .end((err, res) =>{
        expect(res.text).to.eql('{"venue":"testVenue"}');
        done();
      })
  })
  it('should update an object on put', (done) => {
    chai.request('http://localhost:3000')
      .put('/venues/testVenue')
      .send({venue: 'testVenue', neighborhood: 'Capitol Hill'})
      .end((err, res) => {
        expect(res.text).to.eql('rewrote testVenue');
        done();
      })
  })
  it('putted object should be updated', (done) => {
    chai.request('http://localhost:3000')
      .get('/venues/testVenue')
      .end((err, res) => {
        expect(res.text).to.eql('{"venue":"testVenue","neighborhood":"Capitol Hill"}')
        done();
      })
  })
})
