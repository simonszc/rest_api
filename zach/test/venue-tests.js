'use strict';

const chai = require('chai');
const chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
const expect = chai.expect;
const request = chai.request;
const Venue = require('./../schema/venue');
const mongoose = require('mongoose');
const dbPort = process.env.MONGOLAB_URI;

process.env.MONGOLAB_URI = 'mongodb://localhost/test_db';
require('../server.js');

describe('venue tests', () => {
  after((done) => {
    process.env.MONGOLAB_URI = dbPort;
    mongoose.connection.db.dropDatabase(() => {
      done();
    });
  });
  it('should get a list of venues', (done) => {
    request('localhost:3000')
      .get('/venues/')
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(Array.isArray(res.body)).to.eql(true);
        done();
      });
    });
    it('should create a venue', (done) => {
      request('localhost:3000')
        .post('/venues/')
        .send({name: 'annex', neighborhood: 'capitol hill', servesAlcohol: true, performances: []})
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res).to.have.status(200);
          expect(res.body.name).to.eql('annex');
          expect(res.body).to.have.property('_id');
          expect(res.body.servesAlcohol).to.eql(true);
          done();
        });
    });
    describe('tests that need data', () => {
      let testVenue;
      beforeEach((done) => {
        let newVenue = new Venue({name: 'test', neighborhood: 'testland', servesAlcohol: false});
        newVenue.save((err, venue) => {
          testVenue = venue;
          done();
        });
      });
      it('should update a venue', (done) => {
        testVenue.name = 'testParty';
        testVenue.servesAlcohol = true;
        request('localhost:3000')
          .put('/venues/')
          .send(testVenue)
          .end((err, res) => {
            expect(err).to.eql(null);
            expect(res).to.have.status(200);
            expect(res.body.message).to.eql('successfully updated');
            done();
          });
      });
      it('should delete a venue', (done) => {
        request('localhost:3000')
          .delete('/venues/' + testVenue._id)
          .end((err, res) => {
            expect(err).to.eql(null);
            expect(res).to.have.status(200);
            expect(res.body.message).to.eql('successfully deleted');
            done();
          });
      });
    });
});
