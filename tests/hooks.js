/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const { expect } = require('chai')
const config = require('../config.js')
const utils = require('../wt-js-libs/libs/utils/index')
const { app } = require('../src/srv/service')

const gasMargin = 1.5
const addressZero = '0x0000000000000000000000000000000000000000000000000000000000000000'
let index
let fundingSource
let daoAccount
let ownerAccount
let server

const Before = () => (
  before(async function () {
    config.set('web3Provider', 'http://localhost:8545')
    config.updateWeb3Provider()
    config.set('privateKeyDir', 'keys/test.json')
    const wallet = await config.get('web3').eth.accounts.wallet.create(2)
    const accounts = await config.get('web3').eth.getAccounts()
    fundingSource = accounts[0]
    ownerAccount = wallet['0'].address
    daoAccount = wallet['1'].address

    await utils.fundAccount(fundingSource, ownerAccount, '50', config.get('web3'))
    await utils.fundAccount(fundingSource, daoAccount, '50', config.get('web3'))
  })
)
const BeforeEach = () => (
  beforeEach(async function () {
    index = await utils.deployIndex({
      owner: daoAccount,
      gasMargin: gasMargin,
      web3: config.get('web3')
    })
    expect(index._address).to.not.equal(addressZero)
    config.set('indexAddress', index._address)
    server = await app.listen(3000)
  })
)
const AfterEach = () => (
  afterEach(async function () {
    return server.close()
  })
)

module.exports = {
  AfterEach,
  BeforeEach,
  Before
}
