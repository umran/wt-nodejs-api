/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const path = require('path');
const request = require('supertest');
const config = require('../../src/config');
const TEST_ACCOUNT_FILE = path.resolve('test/utils/test-keyfile.json');
const { expect } = require('chai');
const { PASSWORD_HEADER } = require('../../src/constants');
const { deployIndexAndHotel } = require('../utils/hooks.js');
const { loadKeyfile,
  storeKeyFile,
} = require('../../src/helpers/keyfiles');

describe.only('Wallet', function () {
  let server;
  let privateKeyFile;
  before(async () => {
    privateKeyFile = config.get('privateKeyFile');
    config.set('privateKeyFile', path.resolve('keys/test-keyfile.json'));
    storeKeyFile(await loadKeyfile(TEST_ACCOUNT_FILE), config.get('privateKeyFile'));
  });
  beforeEach(async () => {
    server = require('../../src/index');
    await deployIndexAndHotel();
  });
  afterEach(() => {
    server.close();
  });
  after(() => {
    config.set('privateKeyFile', privateKeyFile);
  });
  it('GET /wallets. Expect 200', (done) => {
    request(server)
      .get('/wallets')
      .set('content-type', 'application/json')
      .set('accept', 'application/json')
      .set(PASSWORD_HEADER, config.get('password'))
      .expect((res) => {
        expect(res.body.keyStoreV3).to.be.ok;
      })
      .expect(200, done);
  });

  it('POST /wallets. Expect 200', async () => {
    request(server)
      .post('/wallets')
      .set('content-type', 'application/json')
      .set('accept', 'application/json')
      .send({ keyStoreV3: await loadKeyfile(TEST_ACCOUNT_FILE) })
      .set(PASSWORD_HEADER, config.get('password'))
      .expect(200);
  });

  it('DELETE /wallets. Expect 200', (done) => {
    request(server)
      .delete('/wallets')
      .set('content-type', 'application/json')
      .set('accept', 'application/json')
      .set(PASSWORD_HEADER, config.get('password'))
      .expect((res) => {
        expect(res.body.keyStoreV3).to.be.ok;
      })
      .expect(200, done);
  });
});
