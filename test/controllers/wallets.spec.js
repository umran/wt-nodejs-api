/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const request = require('supertest');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const { expect } = require('chai');

const { WALLET_PASSWORD_HEADER } = require('../../src/constants');
const config = require('../../src/config');
const wallet = require('../utils/keys/ffa1e3be-e80a-4e1c-bb71-ed54c3bef115');
const walletPassword = 'test123';
const secondWallet = require('../utils/keys/7fe84016-4686-4622-97c9-dc7b47f5f5c6');
const secondWalletPassword = 'windingtree';

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const unlink = promisify(fs.unlink);

describe('Wallet', function () {
  let server;
  let originalKeyStorage;
  let walletEncoded, secondWalletEncoded;
  const tempPath = path.resolve('test/utils/temp-keys');

  before(() => {
    originalKeyStorage = config.get('keyFileStorage');
    config.set('keyFileStorage', tempPath);
  });

  beforeEach(async () => {
    server = require('../../src/index');
    walletEncoded = (await readFile(path.resolve('test/utils/keys/ffa1e3be-e80a-4e1c-bb71-ed54c3bef115.enc'))).toString();
    secondWalletEncoded = (await readFile(path.resolve('test/utils/keys/7fe84016-4686-4622-97c9-dc7b47f5f5c6.enc'))).toString();
    await writeFile(path.resolve(config.get('keyFileStorage'), 'ffa1e3be-e80a-4e1c-bb71-ed54c3bef115.enc'), walletEncoded, { encoding: 'utf8', flag: 'w' });
  });

  afterEach(async () => {
    server.close();
    if (fs.existsSync(path.resolve(tempPath, wallet.id))) {
      await unlink(path.resolve(tempPath, wallet.id));
    }
    if (fs.existsSync(path.resolve(tempPath, secondWallet.id))) {
      await unlink(path.resolve(tempPath, secondWallet.id));
    }
  });

  after(() => {
    config.set('keyFileStorage', originalKeyStorage);
  });

  describe('POST /wallets', () => {
    it('should create a wallet', async () => {
      const res = await request(server)
        .post('/wallets')
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .send(secondWallet)
        .set(WALLET_PASSWORD_HEADER, secondWalletPassword)
        .expect(200);
      expect(res.body).to.have.property('id', secondWallet.id);
      const fileContents = (fs.readFileSync(path.resolve(tempPath, `${secondWallet.id}.enc`))).toString();
      expect(fileContents).to.be.eql(secondWalletEncoded);
    });

    it('should not break on a wallet that already exists with the same content', async () => {
      const res = await request(server)
        .post('/wallets')
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .send(wallet)
        .set(WALLET_PASSWORD_HEADER, walletPassword)
        .expect(200);
      expect(res.body).to.have.property('id', wallet.id);
      const fileContents = (fs.readFileSync(path.resolve(tempPath, `${wallet.id}.enc`))).toString();
      expect(fileContents).to.be.eql(walletEncoded);
    });

    it('should break on a wallet that already exists with a different content', async () => {
      let customWallet = Object.assign({}, secondWallet);
      customWallet.id = wallet.id;
      const res = await request(server)
        .post('/wallets')
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .send(customWallet)
        .set(WALLET_PASSWORD_HEADER, secondWalletPassword)
        .expect(409);
      expect(res.body).to.have.property('code', '#walletConflict');
    });

    it('should not create a wallet when a bad password is provided', async () => {
      const res = await request(server)
        .post('/wallets')
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .send(secondWallet)
        .set(WALLET_PASSWORD_HEADER, walletPassword)
        .expect(401);
      expect(res.body).to.have.property('code', '#cannotUnlockWallet');
    });

    it('should not create a wallet without a password', async () => {
      const res = await request(server)
        .post('/wallets')
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .send(secondWallet)
        .expect(401);
      expect(res.body).to.have.property('code', '#missingPassword');
    });

    it('should not create a wallet with some fields missing', async () => {
      let customWallet = Object.assign({}, secondWallet);
      delete customWallet.crypto;
      const res = await request(server)
        .post('/wallets')
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .send(customWallet)
        .set(WALLET_PASSWORD_HEADER, secondWalletPassword)
        .expect(400);
      expect(res.body).to.have.property('code', '#badWalletFormat');
    });
  });

  describe('GET /wallets/:walletId', () => {
    it('should respond with 200 when wallet exists and password is ok', async () => {
      await request(server)
        .get(`/wallets/${wallet.id}`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .set(WALLET_PASSWORD_HEADER, walletPassword)
        .expect(200);
    });

    it('should respond with 401 when wallet exists and password is not ok', async () => {
      const res = await request(server)
        .get(`/wallets/${wallet.id}`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .set(WALLET_PASSWORD_HEADER, secondWalletPassword)
        .expect(401);
      expect(res.body).to.have.property('code', '#cannotUnlockWallet');
    });

    it('should respond with 401 when password is not sent', async () => {
      const res = await request(server)
        .get(`/wallets/${wallet.id}`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect(401);
      expect(res.body).to.have.property('code', '#missingPassword');
    });

    it('should respond with 404 when wallet does not exist', async () => {
      const res = await request(server)
        .get('/wallets/some-random-nonexistent-wallet-id')
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .set(WALLET_PASSWORD_HEADER, walletPassword)
        .expect(404);
      expect(res.body).to.have.property('code', '#walletNotFound');
    });
  });

  describe('DELETE /wallets/:walletId', () => {
    it('should delete a wallet', async () => {
      await request(server)
        .delete(`/wallets/${wallet.id}`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .set(WALLET_PASSWORD_HEADER, walletPassword)
        .expect(204);
    });

    it('should not delete a wallet when a bad password is provided', async () => {
      const res = await request(server)
        .delete(`/wallets/${wallet.id}`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .set(WALLET_PASSWORD_HEADER, secondWalletPassword)
        .expect(401);
      expect(res.body).to.have.property('code', '#cannotUnlockWallet');
    });

    it('should not delete a wallet without a password', async () => {
      const res = await request(server)
        .delete(`/wallets/${wallet.id}`)
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .expect(401);
      expect(res.body).to.have.property('code', '#missingPassword');
    });

    it('should not delete a nonexistent wallet', async () => {
      const res = await request(server)
        .delete('/wallets/some-random-wallet-nonexistent-id')
        .set('content-type', 'application/json')
        .set('accept', 'application/json')
        .set(WALLET_PASSWORD_HEADER, walletPassword)
        .expect(404);
      expect(res.body).to.have.property('code', '#walletNotFound');
    });
  });
});
