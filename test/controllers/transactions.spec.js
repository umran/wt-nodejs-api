/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const { expect } = require('chai');
const sinon = require('sinon');
const request = require('supertest');
const {
  deployIndexAndHotel,
} = require('../utils/helpers');
const wtJsLibs = require('../../src/services/wt-js-libs');

describe('Transactions', function () {
  let server;
  beforeEach(async () => {
    server = require('../../src/index');
    // Deploy something to have some live transactions
    await deployIndexAndHotel();
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

    it('should parse the list of transactionIds', (done) => {
      request(server)
        .get('/transactions?transactionIds=0x52f67ef99966e8b6b46047e3b57ea5499aaf21b9efd21f4f55cc2c3176a64db7,0xd4a887be015ed0fb03ca73e29ed1c4c2b6d5a59d2207a4d9c9dc962d44bbc321')
        .expect('content-type', /application\/json/i)
        .expect((res) => {
          expect(res.body).to.have.nested.property('meta.total', 2);
          expect(res.body).to.have.nested.property('results');
          expect(res.body.results).to.not.be.empty;
        })
        .expect(200, done);
    });

    it('should not panic on weird separator', (done) => {
      request(server)
        .get('/transactions?transactionIds=0x52f67ef99966e8b6b46047e3b57ea5499aaf21b9efd21f4f55cc2c3176a64db7;0xd4a887be015ed0fb03ca73e29ed1c4c2b6d5a59d2207a4d9c9dc962d44bbc321')
        .expect('content-type', /application\/json/i)
        .expect((res) => {
          expect(res.body).to.have.nested.property('meta.total', 1);
          expect(res.body).to.have.nested.property('results');
          expect(res.body.results).to.be.empty;
        })
        .expect(200, done);
    });

    it('should work for only one transactionId', (done) => {
      request(server)
        .get('/transactions?transactionIds=0x52f67ef99966e8b6b46047e3b57ea5499aaf21b9efd21f4f55cc2c3176a64db7')
        .expect('content-type', /application\/json/i)
        .expect((res) => {
          expect(res.body).to.have.nested.property('meta.total', 1);
          expect(res.body).to.have.nested.property('results');
          expect(res.body.results).to.not.be.empty;
        })
        .expect(200, done);
    });

    it('should ask the transaction status from libs', (done) => {
      const wtjLibsSpy = sinon.spy(wtJsLibs.getInstance(), 'getTransactionsStatus');
      request(server)
        .get('/transactions?transactionIds=0x52f67ef99966e8b6b46047e3b57ea5499aaf21b9efd21f4f55cc2c3176a64db7')
        .expect('content-type', /application\/json/i)
        .expect((res) => {
          expect(res.body).to.have.nested.property('meta.total', 1);
          expect(res.body).to.have.nested.property('results');
          expect(res.body.results).to.not.be.empty;
          expect(wtjLibsSpy.callCount).to.be.eql(1);
          wtjLibsSpy.restore();
        })
        .expect(200, done);
    });

    it('should properly compute the metadata', (done) => {
      // The first two should always be mined as they represent first two txs of the accounts[0].
      // If no other tests are run, the deployIndexAndHotel in beforeEach
      // should ensure they exist on chain.
      // The others are randomly picked tx ids from live network
      const transactions = [
        '0x52f67ef99966e8b6b46047e3b57ea5499aaf21b9efd21f4f55cc2c3176a64db7',
        '0xd4a887be015ed0fb03ca73e29ed1c4c2b6d5a59d2207a4d9c9dc962d44bbc321',
        '0x729e91d7994ce14d4bef89bf724468f278a760171621347844d3a870d5133308',
        '0x0ad3abfae15553716d22d2a1fefe6f631f3ca23d44628aabbc91d96e38a27bbc',
      ];
      request(server)
        .get(`/transactions?transactionIds=${transactions.join(',')}`)
        .expect('content-type', /application\/json/i)
        .expect((res) => {
          expect(res.body).to.have.nested.property('meta.total', 4);
          expect(res.body).to.have.nested.property('meta.processed', 2);
          expect(res.body).to.have.nested.property('meta.allPassed', false);
          expect(res.body).to.have.nested.property('meta.minBlockAge');
          expect(res.body).to.have.nested.property('meta.maxBlockAge');
          expect(res.body.meta.maxBlockAge).to.be.above(res.body.meta.minBlockAge);
          expect(res.body.meta.maxBlockAge - res.body.meta.minBlockAge).to.be.at.most(1);
          expect(res.body.results).to.have.property(transactions[0]);
          expect(res.body.results).to.have.property(transactions[1]);
          for (let i in [0, 1]) {
            expect(res.body.results[transactions[i]]).to.have.property('transactionHash');
            expect(res.body.results[transactions[i]]).to.have.property('blockAge');
            expect(res.body.results[transactions[i]]).to.have.property('decodedLogs');
            expect(res.body.results[transactions[i]]).to.have.nested.property('from');
            expect(res.body.results[transactions[i]]).to.have.nested.property('to');
            expect(res.body.results[transactions[i]]).to.have.property('raw');
            expect(res.body.results[transactions[i]]).to.have.nested.property('raw.transactionHash');
            expect(res.body.results[transactions[i]]).to.have.nested.property('raw.transactionIndex');
            expect(res.body.results[transactions[i]]).to.have.nested.property('raw.blockNumber');
            expect(res.body.results[transactions[i]]).to.have.nested.property('raw.blockHash');
            expect(res.body.results[transactions[i]]).to.have.nested.property('raw.contractAddress');
            expect(res.body.results[transactions[i]]).to.have.nested.property('raw.cumulativeGasUsed');
            expect(res.body.results[transactions[i]]).to.have.nested.property('raw.gasUsed');
            expect(res.body.results[transactions[i]]).to.have.nested.property('raw.logs');
            expect(res.body.results[transactions[i]]).to.have.nested.property('raw.status');
          }
        })
        .expect(200, done);
    });

    it('should not panic on a non-existent transaction id', (done) => {
      request(server)
        .get('/transactions?transactionIds=some-totally-random-txid')
        .expect('content-type', /application\/json/i)
        .expect((res) => {
          expect(res.body).to.have.nested.property('meta.total', 1);
          expect(res.body).to.have.nested.property('meta.processed', 0);
          expect(res.body).to.have.nested.property('results');
          expect(res.body.results).to.be.empty;
        })
        .expect(200, done);
    });

    it('should not panic on one multiple non-existent transaction ids', (done) => {
      request(server)
        .get('/transactions?transactionIds=some-totally-random-txid,another-totally-random-txid')
        .expect('content-type', /application\/json/i)
        .expect((res) => {
          expect(res.body).to.have.nested.property('meta.total', 2);
          expect(res.body).to.have.nested.property('meta.processed', 0);
          expect(res.body).to.have.nested.property('results');
          expect(res.body.results).to.be.empty;
        })
        .expect(200, done);
    });
  });
});
