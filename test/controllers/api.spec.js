/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const { expect } = require('chai');
const request = require('supertest');
const config = require('../../src/config');

describe('API', function () {
  let server;
  beforeEach(() => {
    server = require('../../src/index');
  });
  afterEach(() => {
    server.close();
  });

  it('GET /', (done) => {
    request(server)
      .get('/')
      .expect((res) => {
        expect(res.body).to.have.property('docs');
        expect(res.body).to.have.property('info');
        expect(res.body).to.have.property('version');
      })
      .expect(200, done);
  });

  it('GET /docs', (done) => {
    request(server)
      .get('/docs/')
      .expect('content-type', /html/i)
      .expect((res) => {
        expect(res.text).to.not.be.empty;
      })
      .expect(200, done);
  });

  it('GET with not whitelisted ip. Expect #whiteList', (done) => {
    config.set('whiteList', ['11.22.33.44']);
    request(server)
      .get('/')
      .expect((res) => {
        expect(res.body).to.have.property('code', '#whiteList');
      })
      .expect(403, done);
  });

  it('Allow all ips with empty whiteList', (done) => {
    config.set('whiteList', []);
    request(server)
      .get('/')
      .expect(200, done);
  });
});
