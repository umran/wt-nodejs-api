/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const { expect } = require('chai');
const request = require('supertest');
const config = require('../../src/config');

const { PASSWORD_HEADER } = require('../../src/helpers/validators');
const {
  deployIndexAndHotel,
} = require('../utils/hooks.js');

describe('Hotels', function () {
  let server;
  beforeEach(async () => {
    server = require('../../src/index');
    await deployIndexAndHotel();
  });
  afterEach(() => {
    server.close();
  });

  it('GET /hotels. Expect 200', (done) => {
    request(server)
      .get('/hotels')
      .set('content-type', 'application/json')
      .set('accept', 'application/json')
      .expect((res) => {
        expect(res.body.length).to.be.eql(1);
      })
      .expect(200, done);
  });

  it('GET /hotels/:hotelAddress. Expect 200', (done) => {
    request(server)
      .get(`/hotels/${config.get('testAddress')}`)
      .set('content-type', 'application/json')
      .set('accept', 'application/json')
      .expect((res) => {
        expect(res.body).to.have.property('name', 'Test hotel');
        expect(res.body).to.have.property('description', 'Test Hotel description');
      })
      .expect(200, done);
  });

  it('POST /hotels. Expect 202', (done) => {
    const hotelName = 'Test Hotel';
    const hotelDesc = 'Natural and charming atmosphere';
    request(server)
      .post('/hotels')
      .set('content-type', 'application/json')
      .set('accept', 'application/json')
      .set(PASSWORD_HEADER, config.get('password'))
      .send({
        'description': hotelDesc,
        'name': hotelName,
      })
      .expect((res) => {
        expect(res.body).to.have.property('address');
        expect(res.body).to.have.property('transactionIds');
        expect(res.body.transactionIds.length).to.be.above(0);
      })
      .expect(202, done);
  });

  it('POST /hotels. Expect 401 #missingPassword', (done) => {
    const hotelName = 'Test Hotel';
    const hotelDesc = 'Natural and charming atmosphere';
    request(server)
      .post('/hotels')
      .set('content-type', 'application/json')
      .set('accept', 'application/json')
      .set(PASSWORD_HEADER, config.get('password'))
      .send({
        'description': hotelDesc,
        'name': hotelName,
      })
      .expect((res) => {
        expect(res.body).to.have.property('code', '#missingPassword');
      })
      .expect(401, done);
  });

  it('PUT /hotels/:hotelAddress. Expect 202', (done) => {
    const name = 'WT Hotel';
    const description = 'Best hotel for developers.';
    request(server)
      .put(`/hotels/${config.get('testAddress')}`)
      .set('content-type', 'application/json')
      .set('accept', 'application/json')
      .set(PASSWORD_HEADER, config.get('password'))
      .send({
        'description': description,
        'name': name,
      })
      .expect((res) => {
        expect(res.body.length).to.be.above(0);
      })
      .expect(202, done);
  });

  it('PUT /hotels/:hotelAddress. Expect 401 #missingPassword', (done) => {
    const name = 'WT Hotel';
    const description = 'Best hotel for developers.';
    request(server)
      .put(`/hotels/${config.get('testAddress')}`)
      .set('content-type', 'application/json')
      .set('accept', 'application/json')
      .send({
        'description': description,
        'name': name,
      })
      .expect((res) => {
        expect(res.body).to.have.property('code', '#missingPassword');
      })
      .expect(401, done);
  });

  it('DELETE /hotels/:hotelAddress. Expect 202', (done) => {
    request(server)
      .delete(`/hotels/${config.get('testAddress')}`)
      .set('content-type', 'application/json')
      .set('accept', 'application/json')
      .set(PASSWORD_HEADER, config.get('password'))
      .expect((res) => {
        expect(res.body.length).to.be.above(0);
      })
      .expect(202, done);
  });

  it('DELETE /hotels/:hotelAddress. Expect 400 #missingPassword', (done) => {
    request(server)
      .delete(`/hotels/${config.get('testAddress')}`)
      .set('content-type', 'application/json')
      .set('accept', 'application/json')
      .expect((res) => {
        expect(res.body).to.have.property('code', '#missingPassword');
      })
      .expect(401, done);
  });
});
