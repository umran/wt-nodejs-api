/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const request = require('supertest');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const { expect } = require('chai');

const { WALLET_PASSWORD_HEADER } = require('../../src/constants');
const config = require('../../src/config');
const wallet = require('../utils/keys/ffa1e3be-e80a-4e1c-bb71-ed54c3bef115.json');
const walletPassword = 'test123';
const secondWallet = require('../utils/keys/7fe84016-4686-4622-97c9-dc7b47f5f5c6.json');
const secondWalletPassword = 'windingtree';

const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

describe('Wallet', function () {
  let server;
  let originalKeyStorage;
  const tempPath = path.resolve('test/utils/temp-keys');

  before(() => {
    originalKeyStorage = config.get('keyFileStorage');
    config.set('keyFileStorage', tempPath);
  });

  beforeEach(async () => {
    server = require('../../src/index');
    await writeFile(path.resolve(config.get('keyFileStorage'), `${wallet.id}.json`), JSON.stringify(wallet), { encoding: 'utf8', flag: 'w' });
  });

  afterEach(async () => {
    server.close();
    if (fs.existsSync(path.resolve(tempPath, `${wallet.id}.json`))) {
      await unlink(path.resolve(tempPath, `${wallet.id}.json`));
    }
    if (fs.existsSync(path.resolve(tempPath, `${secondWallet.id}.json`))) {
      await unlink(path.resolve(tempPath, `${secondWallet.id}.json`));
    }
  });

  after(() => {
    config.set('keyFileStorage', originalKeyStorage);
  });

  describe('POST /wallets', () => {
    it('should create a wallet', (done) => {
      request(server)
        .post('/wallets')
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .send(secondWallet)
        .set(WALLET_PASSWORD_HEADER, secondWalletPassword)
        .expect(200)
        .end((err, res) => {
          if (err) { return done(err); }
          expect(res.body).to.have.property('id', secondWallet.id);
          const fileContents = JSON.parse(fs.readFileSync(path.resolve(tempPath, `${secondWallet.id}.json`)));
          expect(fileContents).to.have.property('id', secondWallet.id);
          expect(fileContents).to.have.property('address', secondWallet.address);
          expect(fileContents).to.have.deep.property('crypto', secondWallet.crypto);
          done();
        });
    });

    it('should not break on a wallet that already exists with the same content', (done) => {
      request(server)
        .post('/wallets')
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .send(wallet)
        .set(WALLET_PASSWORD_HEADER, walletPassword)
        .expect(200)
        .end((err, res) => {
          if (err) { return done(err); }
          expect(res.body).to.have.property('id', wallet.id);
          const fileContents = JSON.parse(fs.readFileSync(path.resolve(tempPath, `${wallet.id}.json`)));
          expect(fileContents).to.have.property('id', wallet.id);
          expect(fileContents).to.have.property('address', wallet.address);
          expect(fileContents).to.have.deep.property('crypto', wallet.crypto);
          done();
        });
    });

    it('should break on a wallet that already exists with a different content', (done) => {
      let customWallet = Object.assign({}, secondWallet);
      customWallet.id = wallet.id;
      request(server)
        .post('/wallets')
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .send(customWallet)
        .set(WALLET_PASSWORD_HEADER, secondWalletPassword)
        .expect(400)
        .end((err, res) => {
          if (err) { return done(err); }
          expect(res.body).to.have.property('code', '#walletConflict');
          done();
        });
    });

    it('should not create a wallet when a bad password is provided', (done) => {
      request(server)
        .post('/wallets')
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .send(secondWallet)
        .set(WALLET_PASSWORD_HEADER, walletPassword)
        .expect(401)
        .end((err, res) => {
          if (err) { return done(err); }
          expect(res.body).to.have.property('code', '#cannotUnlockWallet');
          done();
        });
    });

    it('should not create a wallet without a password', (done) => {
      request(server)
        .post('/wallets')
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .send(secondWallet)
        .expect(401)
        .end((err, res) => {
          if (err) { return done(err); }
          expect(res.body).to.have.property('code', '#missingPassword');
          done();
        });
    });

    it('should not create a wallet with some fields missing', (done) => {
      let customWallet = Object.assign({}, secondWallet);
      delete customWallet.crypto;
      request(server)
        .post('/wallets')
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .send(customWallet)
        .set(WALLET_PASSWORD_HEADER, secondWalletPassword)
        .expect(400)
        .end((err, res) => {
          if (err) { return done(err); }
          expect(res.body).to.have.property('code', '#badWalletFormat');
          done();
        });
    });
  });

  xdescribe('GET /wallets/:walletId', () => {

  });

  describe('DELETE /wallets/:walletId', () => {
    it('should delete a wallet', (done) => {
      request(server)
        .delete(`/wallets/${wallet.id}`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .set(WALLET_PASSWORD_HEADER, walletPassword)
        .expect(204, done);
    });

    it('should not delete a wallet when a bad password is provided', (done) => {
      request(server)
        .delete(`/wallets/${wallet.id}`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .set(WALLET_PASSWORD_HEADER, secondWalletPassword)
        .expect(401)
        .end((err, res) => {
          if (err) { return done(err); }
          expect(res.body).to.have.property('code', '#cannotUnlockWallet');
          done();
        });
    });

    it('should not delete a wallet without a password', (done) => {
      request(server)
        .delete(`/wallets/${wallet.id}`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect(401)
        .end((err, res) => {
          if (err) { return done(err); }
          expect(res.body).to.have.property('code', '#missingPassword');
          done();
        });
    });

    it('should not delete a nonexistent wallet', (done) => {
      request(server)
        .delete('/wallets/some-random-wallet-nonexistent-id')
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .set(WALLET_PASSWORD_HEADER, walletPassword)
        .expect(404)
        .end((err, res) => {
          if (err) { return done(err); }
          expect(res.body).to.have.property('code', '#walletNotFound');
          done();
        });
    });
  });
});
