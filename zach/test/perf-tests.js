'use strict';

const chai = require('chai');
const chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
const expect = chai.expect;
const request = chai.request;
const Performance = require('./../schema/performance');
const mongoose = require('mongoose');
const dbPort = process.env.MONGOLAB_URI;

process.env.MONGOLAB_URI = 'mongodb://localhost/test_db';
require('../server.js');

describe('performances tests', () => {
  before((done) => {
    request('localhost:3000')
      .post('/venues')
      .send({name: 'annex', neighborhood: 'capitol hill', servesAlcohol: true})
      .end((err, res) => {
        if (err) console.log(err.message);
        done();
      })
  })
  after((done) => {
    process.env.MONGOLAB_URI = dbPort;
    mongoose.connection.db.dropDatabase(() => {
      done();
    });
  });
  it('should get a list of performances', (done) => {
    request('localhost:3000')
      .get('/performances/')
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(Array.isArray(res.body)).to.eql(true);
        done();
      });
  });
  it('should create a performance', (done) => {
    request('localhost:3000')
      .post('/performances/')
      .send({name: 'frankenstein', venue: 'annex'})
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.body.name).to.eql('frankenstein');
        expect(res.body).to.have.property('_id');
        expect(res.body.venueObject[0]).to.have.property('_id');
        done();
      });
  });
  describe('tests that need data', () => {
    let testPerformance = {name: 'test', venue: 'annex'};
    beforeEach((done) => {
      request('localhost:3000')
      .post('/performances')
      .send(testPerformance)
      .end((err, res) => {
        done();
      });
    });
    it('should update a performance', (done) => {
      testPerformance.name = 'test';
      testPerformance.startDate = new Date(2006,4,5,16,15);
      request('localhost:3000')
        .put('/performances/')
        .send(testPerformance)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res).to.have.status(200);
          expect(res.body.message).to.eql('test successfully updated');
          done();
        });
    });
    it('should delete a performance', (done) => {
      request('localhost:3000')
        .delete('/performances/' + testPerformance.name)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res).to.have.status(200);
          expect(res.body.message).to.eql('test successfully deleted');
          done();
        });
    })
  });
});
