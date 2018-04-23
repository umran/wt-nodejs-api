/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const { expect } = require('chai');
const request = require('supertest');

describe('Transactions', function () {
  let server;
  beforeEach(() => {
    server = require('../../src/index');
  });
  afterEach(() => {
    server.close();
  });

  describe('GET /transactions', () => {
    it('should return empty response when no transactionIds are passed', (done) => {
      request(server)
        .get('/transactions')
        .expect('content-type', /application\/json/i)
        .expect((res) => {
          expect(res.body).to.have.nested.property('meta.total', 0);
          expect(res.body).to.have.nested.property('results');
          expect(res.body.results).to.be.empty;
        })
        .expect(200, done);
    });

    it('should parse the list of transactionIds', () => {

    });

    it('should work for only one transactionId', () => {

    });

    it('should ask the transaction status from libs', () => {

    });

    it('should properly compute the metadata', () => {

    });

    it('should not panic on a non-existent transaction id', () => {

    });

    it('should not panic on one multiple non-existent transaction ids', () => {

    });
  });
});
