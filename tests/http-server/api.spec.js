/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const { expect } = require('chai')
const utils = require('../../wt-js-libs/libs/utils/index')
const HotelManager = require('../../libs/HotelManager')
const { app } = require('../../src/srv/service')
const Web3 = require('web3')
const provider = new Web3.providers.HttpProvider('http://localhost:8545')
const web3 = new Web3(provider)
const fetch = require('node-fetch')

describe('API', function () {
  const gasMargin = 1.5

  let index
  let fundingSource
  let daoAccount
  let ownerAccount
  let server

  before(async function () {
    const wallet = await web3.eth.accounts.wallet.create(2)
    const accounts = await web3.eth.getAccounts()

    fundingSource = accounts[0]
    ownerAccount = wallet['0'].address
    daoAccount = wallet['1'].address

    await utils.fundAccount(fundingSource, ownerAccount, '50', web3)
    await utils.fundAccount(fundingSource, daoAccount, '50', web3)

    server = await app.listen(3000)
  })

  beforeEach(async function () {
    index = await utils.deployIndex({
      owner: daoAccount,
      gasMargin: gasMargin,
      web3: web3
    })
  })

  after(async function () {
    server.close()
  })

  it('API documentation', async () => {
    await fetch('http://localhost:3000/docs', {
      method: 'GET'
    })
      .then((res) => {
        expect(res).to.be.ok
      })
      .catch(e => {
        expect(e).to.not.exist
      })
  })
})
