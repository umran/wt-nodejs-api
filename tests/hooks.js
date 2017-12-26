/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const { expect } = require('chai')
const fs = require('fs')
const config = require('../config.js')
const utils = require('../wt-js-libs/libs/utils/index')
const { app } = require('../src/srv/service')
const HotelManager = require('../libs/HotelManager.js')
const { loadAccount } = require('../src/helpers/crypto')
const gasMargin = 1.5
const addressZero = '0x0000000000000000000000000000000000000000000000000000000000000000'
let index
let fundingSource
let daoAccount
let ownerAccount
let server

const Before = () => (
  before(async function () {
    config.set('password', 'test123')
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

    const cryptedAccount = config.get('web3').eth.accounts.wallet[0].encrypt(config.get('password'))
    fs.writeFileSync(config.get('privateKeyDir'), JSON.stringify(cryptedAccount), 'utf8')
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
    await generateHotel(daoAccount)
    server = await app.listen(3000)
  })
)
const AfterEach = () => (
  afterEach(async function () {
    return server.close()
  })
)

async function generateHotel (ownerAddres) {
  const hotelName = 'Hotel'
  const hotelDesc = ' Hotel desc'
  const typeName = 'TYPE_000'
  const url = 'image.jpeg'

  ownerAccount = config.get('web3').eth.accounts.decrypt(loadAccount(config.get('privateKeyDir')), config.get('password'))
  const context = {
    indexAddress: config.get('indexAddress'),
    gasMargin: config.get('gasMargin'),
    owner: ownerAccount.address,
    web3: config.get('web3')
  }
  const hotelManager = new HotelManager(context)
  hotelManager.web3.eth.accounts.wallet.add(ownerAccount)
  await hotelManager.createHotel(hotelName, hotelDesc)
  await hotelManager.getHotels()
  let address = hotelManager.hotelsAddrs[0]
  config.set('testAdress', address)
  await hotelManager.addUnitType(address, typeName)
  await hotelManager.addUnit(address, typeName)
  await hotelManager.addImageHotel(address, url)
}

module.exports = {
  AfterEach,
  BeforeEach,
  Before
}
