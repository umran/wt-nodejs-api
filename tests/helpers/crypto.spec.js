/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const { expect } = require('chai')
const { updateAccountPassword, loadAccount } = require('../../src/helpers/crypto')
const Web3 = require('web3')
const CONFIG = require('../../config.json')

const newPassword = 'newPassword1234567890'
const password = 'test123'
const TEST_ACCOUNT_DIR = 'keys/test.json'
const UPDATED_TEST_ACCOUNT_DIR = 'keys/test-updated.json'

const web3 = new Web3(new Web3.providers.HttpProvider(CONFIG.web3Provider))

describe('Utils test', function () {
  describe('crypto.js', function () {
    it('Load account. Expect ok', async function () {
      const privateKeyJSON = loadAccount(TEST_ACCOUNT_DIR)
      expect(privateKeyJSON).to.be.ok
    })
    it('Update password. Expect ok', async function () {
      updateAccountPassword(password, newPassword, loadAccount(TEST_ACCOUNT_DIR), UPDATED_TEST_ACCOUNT_DIR)
      let error, account
      try {
        account = web3.eth.accounts.decrypt(loadAccount(UPDATED_TEST_ACCOUNT_DIR), newPassword)
      } catch (e) {
        error = e
      }
      expect(account).to.be.ok
      expect(error).to.not.exist
    })
    it('Update password. Expect bad password', async function () {
      let error, account
      try {
        account = updateAccountPassword('BAD_PASSWORD', newPassword, loadAccount(TEST_ACCOUNT_DIR), UPDATED_TEST_ACCOUNT_DIR)
      } catch (e) {
        error = e
      }
      expect(error).to.be.ok
      expect(account).to.not.be.ok
    })
  })
})
