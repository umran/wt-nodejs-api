/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const { expect } = require('chai');
const { updateAccount, loadAccount, storeWallet } = require('../../src/helpers/crypto');
const config = require('../../config.js');

const newPassword = 'newPassword1234567890';
const password = 'test123';
const TEST_ACCOUNT_DIR = 'keys/test.json';
const UPDATED_TEST_ACCOUNT_DIR = 'keys/test-updated.json';

describe('Utils test', function () {
  describe('crypto.js', function () {
    it('Create account. Expect ok', async function () {
      config.set('privateKeyDir', 'keys/test.json');
      await config.get('web3').web3.eth.accounts.wallet.create(3);
      const wallet = await config.get('web3').web3.eth.accounts.wallet[0].encrypt(password);
      storeWallet(wallet);
    });
    it('Load account. Expect ok', async function () {
      const privateKeyJSON = loadAccount(TEST_ACCOUNT_DIR);
      expect(privateKeyJSON).to.be.ok;
    });
    it('Update password. Expect ok', async function () {
      updateAccount(password, newPassword, loadAccount(TEST_ACCOUNT_DIR), UPDATED_TEST_ACCOUNT_DIR);
      let error, account;
      try {
        account = config.get('web3').web3.eth.accounts.decrypt(loadAccount(UPDATED_TEST_ACCOUNT_DIR), newPassword);
      } catch (e) {
        error = e;
      }
      expect(account).to.be.ok;
      expect(error).to.not.exist;
    });
    it('Update password. Expect bad password', async function () {
      let error, account;
      try {
        account = updateAccount('BAD_PASSWORD', newPassword, loadAccount(TEST_ACCOUNT_DIR), UPDATED_TEST_ACCOUNT_DIR);
      } catch (e) {
        error = e;
      }
      expect(error).to.be.ok;
      expect(account).to.not.be.ok;
    });
  });
});
