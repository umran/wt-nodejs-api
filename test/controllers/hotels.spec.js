/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const { expect } = require('chai');
const request = require('supertest');
const config = require('../../src/config');
const { WALLET_PASSWORD_HEADER, WALLET_ID_HEADER } = require('../../src/constants');
const {
  deployIndexAndHotel,
} = require('../utils/helpers');

const WALLET_UUID = 'ffa1e3be-e80a-4e1c-bb71-ed54c3bef115';

describe('Hotels', function () {
  let server;
  beforeEach(async () => {
    server = require('../../src/index');
    await deployIndexAndHotel();
  });
  afterEach(() => {
    server.close();
  });

  describe('GET /hotels', () => {
    it('should return a list of hotels', (done) => {
      request(server)
        .get('/hotels')
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect((res) => {
          expect(res.body.hotels.length).to.be.eql(1);
        })
        .expect(200, done);
    });
  });

  describe('GET /hotels/:hotelAddress', () => {
    it('should return a hotel', (done) => {
      const name = 'new hotel';
      const description = 'some description';
      const manager = '0xd39ca7d186a37bb6bf48ae8abfeb4c687dc8f906';
      const location = {
        latitude: 50.0754789,
        longitude: 14.4225864,
      };

      request(server)
        .post('/hotels')
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .set(WALLET_PASSWORD_HEADER, config.get('password'))
        .set(WALLET_ID_HEADER, WALLET_UUID)
        .send({ hotel: { name, description, manager, location } })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('address');
          expect(res.body).to.have.property('transactionIds');
          expect(res.body.transactionIds.length).to.be.above(0);
          request(server)
            .get(`/hotels/${res.body.address}`)
            .set('content-type', 'application/json')
            .set('accept', 'application/json')
            .expect((res) => {
              expect(res.body.hotel).to.have.property('name', name);
              expect(res.body.hotel).to.have.property('description', description);
              expect(res.body.hotel).to.have.property('location');
              expect(res.body.hotel).to.have.nested.property('location.latitude', location.latitude);
              expect(res.body.hotel).to.have.nested.property('location.longitude', location.longitude);
              expect(res.body.hotel).to.have.property('manager');
              expect(res.body.hotel.manager.toLowerCase()).to.be.eql(manager);
            })
            .expect(200, done);
        });
    });

    it('should return a 404 on a non-existent address', (done) => {
      request(server)
        .get('/hotels/0x994afd347b160be3973b41f0a144819496d175e9')
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect(404, done);
    });
  });

  describe('POST /hotels', () => {
    const name = 'new hotel';
    const description = 'some description';
    const manager = '0xd39ca7d186a37bb6bf48ae8abfeb4c687dc8f906';
    const location = {
      latitude: 50.0754789,
      longitude: 14.4225864,
    };

    it('should create transactions on chain that will create a hotel', (done) => {
      request(server)
        .post('/hotels')
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .set(WALLET_PASSWORD_HEADER, config.get('password'))
        .set(WALLET_ID_HEADER, WALLET_UUID)
        .send({ hotel: { name, description, manager, location } })
        .expect((res) => {
          expect(res.body).to.have.property('address');
          expect(res.body).to.have.property('transactionIds');
          expect(res.body.transactionIds.length).to.be.above(0);
        })
        .expect(202, done);
    });

    it('should return 400 on missing manager', (done) => {
      request(server)
        .post('/hotels')
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .set(WALLET_PASSWORD_HEADER, config.get('password'))
        .set(WALLET_ID_HEADER, WALLET_UUID)
        .send({ hotel: { name, description, location } })
        .expect(400)
        .end((err, res) => {
          if (err) { return done(err); }
          expect(res.body).to.have.property('code', '#missingManager');
          expect(res.body).to.have.property('short');
          expect(res.body.short).to.match(/is mandatory/i);
          done();
        });
    });

    it('should return 401 on bad password', (done) => {
      request(server)
        .post('/hotels')
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .set(WALLET_PASSWORD_HEADER, 'random-password')
        .set(WALLET_ID_HEADER, WALLET_UUID)
        .send({ hotel: { name, description, manager, location } })
        .expect(401)
        .end((err, res) => {
          if (err) { return done(err); }
          expect(res.body).to.have.property('code', '#cannotUnlockWallet');
          expect(res.body).to.have.property('short');
          expect(res.body.short).to.match(/cannot be unlocked/i);
          done();
        });
    });

    it('should return 401 on bad wallet id', (done) => {
      request(server)
        .post('/hotels')
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .set(WALLET_PASSWORD_HEADER, config.get('password'))
        .set(WALLET_ID_HEADER, 'random-nonexistent-wallet-id')
        .send({ hotel: { name, description, manager, location } })
        .expect(401)
        .end((err, res) => {
          if (err) { return done(err); }
          expect(res.body).to.have.property('code', '#cannotUnlockWallet');
          expect(res.body).to.have.property('short');
          expect(res.body.short).to.match(/cannot be unlocked/i);
          done();
        });
    });

    it('should return 401 on missing password', (done) => {
      request(server)
        .post('/hotels')
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .set(WALLET_ID_HEADER, WALLET_UUID)
        .send({ hotel: { name, description, manager } })
        .expect(401)
        .end((err, res) => {
          if (err) { return done(err); }
          expect(res.body).to.have.property('code', '#missingPassword');
          expect(res.body).to.have.property('short');
          expect(res.body.short).to.match(/password is required/i);
          done();
        });
    });

    it('should return 401 on missing wallet', (done) => {
      request(server)
        .post('/hotels')
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .set(WALLET_PASSWORD_HEADER, config.get('password'))
        .send({ hotel: { name, description, manager, location } })
        .expect(401)
        .end((err, res) => {
          if (err) { return done(err); }
          expect(res.body).to.have.property('code', '#missingWallet');
          expect(res.body).to.have.property('short');
          expect(res.body.short).to.match(/wallet id is required/i);
          done();
        });
    });
  });

  describe('PUT /hotels/:hotelAddress', () => {
    const name = 'new hotel';
    const description = 'some description';
    const manager = '0xd39ca7d186a37bb6bf48ae8abfeb4c687dc8f906';
    const url = 'ipfs://some-new-shiny-url';
    const location = {
      latitude: 50.0754789,
      longitude: 14.4225864,
    };

    it('should update a hotel', (done) => {
      let address;
      request(server)
        .post('/hotels')
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .set(WALLET_PASSWORD_HEADER, config.get('password'))
        .set(WALLET_ID_HEADER, WALLET_UUID)
        .send({ hotel: { name, description, manager, location } })
        .end((err, res) => {
          if (err) { return done(err); }
          address = res.body.address;
          expect(res.body).to.have.property('address');
          expect(res.body).to.have.property('transactionIds');
          expect(res.body.transactionIds.length).to.be.above(0);
          request(server)
            .put(`/hotels/${res.body.address}`)
            .set('content-type', 'application/json')
            .set('accept', 'application/json')
            .set(WALLET_PASSWORD_HEADER, config.get('password'))
            .set(WALLET_ID_HEADER, WALLET_UUID)
            .send({ hotel: { description: 'Best hotel.', name: 'WTHotel', url: 'new-url' } })
            .expect((res) => {
              expect(res.body.transactionIds.length).to.be.above(0);
            })
            .expect(202)
            .end((err, res) => {
              if (err) { return done(err); }
              request(server)
                .get(`/hotels/${address}`)
                .expect(200)
                .end((err, res) => {
                  if (err) { return done(err); }
                  expect(res.body).to.have.nested.property('hotel.url', 'new-url');
                  expect(res.body).to.have.nested.property('hotel.name', 'WTHotel');
                  expect(res.body).to.have.nested.property('hotel.description', 'Best hotel.');
                  done();
                });
            });
        });
    });

    it('should never update a manager', (done) => {
      request(server)
        .put(`/hotels/${config.get('testAddress')}`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .set(WALLET_PASSWORD_HEADER, config.get('password'))
        .set(WALLET_ID_HEADER, WALLET_UUID)
        .send({ hotel: {
          name,
          description,
          location,
          manager: 'someone-else',
        } })
        .expect(202)
        .end((err, res) => {
          if (err) { return done(err); }
          request(server)
            .get(`/hotels/${config.get('testAddress')}`)
            .expect(200)
            .end((err, res) => {
              if (err) { return done(err); }
              expect(res.body).to.have.nested.property('hotel.manager');
              expect(res.body.hotel.manager.toLowerCase()).to.be.eql(manager);
              done();
            });
        });
    });

    it('should never null url', (done) => {
      request(server)
        .put(`/hotels/${config.get('testAddress')}`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .set(WALLET_PASSWORD_HEADER, config.get('password'))
        .set(WALLET_ID_HEADER, WALLET_UUID)
        .send({ hotel: { url: null } })
        .expect(202)
        .end((err, res) => {
          if (err) { return done(err); }
          request(server)
            .get(`/hotels/${config.get('testAddress')}`)
            .expect(200)
            .end((err, res) => {
              if (err) { return done(err); }
              expect(res.body).to.have.nested.property('hotel.url');
              done();
            });
        });
    });

    it('should return 404 when trying to update non-existing hotel', (done) => {
      request(server)
        .put('/hotels/0x76ccdbb28c18168cc4ab55b11fc3be776e81200c')
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .set(WALLET_PASSWORD_HEADER, config.get('password'))
        .set(WALLET_ID_HEADER, WALLET_UUID)
        .send({ name, description, location })
        .expect(404, done);
    });

    it('should return 401 on updating a hotel of a different manager', (done) => {
      request(server)
        .put(`/hotels/${config.get('testAddress')}`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .set(WALLET_PASSWORD_HEADER, 'windingtree')
        .set(WALLET_ID_HEADER, '7fe84016-4686-4622-97c9-dc7b47f5f5c6')
        // url is required to force interaction with network
        .send({ hotel: { name, description: 'random-updated-description', location, url } })
        .expect(401, done);
    });

    it('should return 401 on bad password', (done) => {
      request(server)
        .put(`/hotels/${config.get('testAddress')}`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .set(WALLET_PASSWORD_HEADER, 'random-password')
        .set(WALLET_ID_HEADER, WALLET_UUID)
        .send({ hotel: { name, description, manager, location } })
        .expect(401)
        .end((err, res) => {
          if (err) { return done(err); }
          expect(res.body).to.have.property('code', '#cannotUnlockWallet');
          expect(res.body).to.have.property('short');
          expect(res.body.short).to.match(/cannot be unlocked/i);
          done();
        });
    });

    it('should return 401 on a missing password', (done) => {
      request(server)
        .put(`/hotels/${config.get('testAddress')}`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .set(WALLET_ID_HEADER, WALLET_UUID)
        .send({ hotel: { name, description, manager, location } })
        .expect(401)
        .end((err, res) => {
          if (err) { return done(err); }
          expect(res.body).to.have.property('code', '#missingPassword');
          expect(res.body).to.have.property('short');
          expect(res.body.short).to.match(/password is required/i);
          done();
        });
    });

    it('should return 401 on a missing wallet id', (done) => {
      request(server)
        .put(`/hotels/${config.get('testAddress')}`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .set(WALLET_PASSWORD_HEADER, config.get('password'))
        .send({ hotel: { name, description, manager, location } })
        .expect(401)
        .end((err, res) => {
          if (err) { return done(err); }
          expect(res.body).to.have.property('code', '#missingWallet');
          expect(res.body).to.have.property('short');
          expect(res.body.short).to.match(/wallet id is required/i);
          done();
        });
    });
  });

  describe('DELETE /hotels/:hotelAddress', () => {
    it('should delete a hotel', (done) => {
      request(server)
        .delete(`/hotels/${config.get('testAddress')}`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .set(WALLET_PASSWORD_HEADER, config.get('password'))
        .set(WALLET_ID_HEADER, WALLET_UUID)
        .expect(202)
        .end((err, res) => {
          if (err) { return done(err); }
          expect(res.body.transactionIds.length).to.be.above(0);
          done();
        });
    });

    it('should return 404 when trying to delete non-existing hotel', (done) => {
      request(server)
        .delete('/hotels/0x76ccdbb28c18168cc4ab55b11fc3be776e81200c')
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .set(WALLET_PASSWORD_HEADER, config.get('password'))
        .set(WALLET_ID_HEADER, WALLET_UUID)
        .expect(404, done);
    });

    it('should return 401 on deleting a hotel of a different manager', (done) => {
      request(server)
        .delete(`/hotels/${config.get('testAddress')}`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .set(WALLET_PASSWORD_HEADER, 'windingtree')
        .set(WALLET_ID_HEADER, '7fe84016-4686-4622-97c9-dc7b47f5f5c6')
        .expect(401, done);
    });

    it('should return 401 on bad password', (done) => {
      request(server)
        .delete(`/hotels/${config.get('testAddress')}`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .set(WALLET_PASSWORD_HEADER, 'random-password')
        .set(WALLET_ID_HEADER, WALLET_UUID)
        .expect(401)
        .end((err, res) => {
          if (err) { return done(err); }
          expect(res.body).to.have.property('code', '#cannotUnlockWallet');
          expect(res.body).to.have.property('short');
          expect(res.body.short).to.match(/cannot be unlocked/i);
          done();
        });
    });

    it('should return 401 on a missing password', (done) => {
      request(server)
        .delete(`/hotels/${config.get('testAddress')}`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .set(WALLET_ID_HEADER, WALLET_UUID)
        .end((err, res) => {
          if (err) { return done(err); }
          expect(res.body).to.have.property('code', '#missingPassword');
          expect(res.body).to.have.property('short');
          expect(res.body.short).to.match(/password is required/i);
          done();
        });
    });

    it('should return 401 on a missing wallet id', (done) => {
      request(server)
        .delete(`/hotels/${config.get('testAddress')}`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .set(WALLET_PASSWORD_HEADER, config.get('password'))
        .end((err, res) => {
          if (err) { return done(err); }
          expect(res.body).to.have.property('code', '#missingWallet');
          expect(res.body).to.have.property('short');
          expect(res.body.short).to.match(/wallet id is required/i);
          done();
        });
    });
  });
});
