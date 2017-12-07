const { expect } = require('chai')
const { decrypt, encrypt, loadAccount } = require('../../src/helpers/crypto')
const fs = require('fs');
const Web3 = require('web3');
const CONFIG = require('../../config.json');

const newPassword = 'newPassword1234567890';
const password = 'test123';
const TEST_ACCOUNT_DIR = 'keys/test.json';
const UPDATED_TEST_ACCOUNT_DIR = 'keys/test-updated.json';

const web3 = new Web3(new Web3.providers.HttpProvider(CONFIG.web3Provider));

describe('Utils test', function () {
  describe('crypto.js',function() {
    it('Load account. Expect ok', async function(){
      expect(loadAccount(TEST_ACCOUNT_DIR)).to.be.ok
    })
    it('Decrypt account. Expect ok', async function(){
      let error, account;
      try {
        account = decrypt(password, loadAccount(TEST_ACCOUNT_DIR));
      } catch (e) {
        error = e;
      }
      expect(account).to.be.ok;
      expect(error).to.not.exist;
    })
    it('Decrypt account. Expect bad password', async function(){
      let error, account;
      try {
        account = decrypt('BAD_PASS', loadAccount(TEST_ACCOUNT_DIR))
      } catch (e) {
        error = e
      }
      expect(error).to.be.ok
    })
    it('Update account password. Expect ok', async function(){
      encrypt(password, newPassword, loadAccount(TEST_ACCOUNT_DIR), UPDATED_TEST_ACCOUNT_DIR)
      let error, account;
      try {
        account = decrypt(newPassword , loadAccount(UPDATED_TEST_ACCOUNT_DIR));
      } catch (e) {
        error = e;
      }
      expect(account).to.be.ok;
      expect(error).to.not.exist;

    })
    it('Encrypt account. Expect bad password', async function(){
      let error, account;
      try {
        account = encrypt('BAD_PASSWORD', newPassword, loadAccount(TEST_ACCOUNT_DIR), UPDATED_TEST_ACCOUNT_DIR)
      } catch (e) {
        error = e
      }
      expect(error).to.be.ok
    })
  })
})
