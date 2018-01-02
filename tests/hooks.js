/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const { expect } = require('chai')
const fetch = require('node-fetch')
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
    await setUpWallet()
    await generateHotel(daoAccount)
  })
)
const AfterEach = () => (
  afterEach(async function () {
    return server.close()
  })
)

async function generateHotel (ownerAddres) {
  let body
  let res
  let hotelAddresses
  const hotelName = 'Hotel'
  const hotelDesc = ' Hotel desc'
  const unitTypeName = 'TYPE_000'
  const amenity = 5
  const url = 'image.jpeg'

  body = JSON.stringify({
    'password': config.get('password'),
    'description': hotelDesc,
    'name': hotelName
  })
  await fetch('http://localhost:3000/hotels', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body
  })

  body = JSON.stringify({
    'password': config.get('password')
  })

  res = await fetch('http://localhost:3000/hotels', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body)
    },
    body
  })

  hotelAddresses = Object.keys(await res.json())
  config.set('testAddress', hotelAddresses[0])
  body = JSON.stringify({
    'password': config.get('password'),
    type: unitTypeName
  })

  res = await fetch(`http://localhost:3000/hotels/${hotelAddresses[0]}/unitTypes`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body
  })

  body = JSON.stringify({
    'password': config.get('password'),
    amenity
  })
  res = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/unitTypes/${unitTypeName}/amenities`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body
  })

  body = JSON.stringify({
    'password': config.get('password')
  })

  res = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/unitTypes/${unitTypeName}/units`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body
  })

  res = await fetch('http://localhost:3000/hotels', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body)
    },
    body
  })
  const hotels = await res.json()
  hotelAddresses = Object.keys(hotels)
  const hotel = hotels[hotelAddresses[0]]
  let unitAddresses = Object.keys(hotel.units)
  expect(hotel).to.have.property('name', hotelName)
  expect(hotel).to.have.property('description', hotelDesc)
  expect(hotel).to.have.property('unitTypeNames')
  expect(hotel.unitTypeNames).to.include(unitTypeName)
  expect(hotel.unitTypes[unitTypeName].amenities).to.include(amenity)
  const unitAdress = hotel.unitAddresses[unitAddresses.length - 1]
  config.set('unitAdress', unitAdress)
  expect(hotel.units[unitAdress]).to.have.property('unitType', unitTypeName)
}

async function setUpWallet () {
  const wallet = await config.get('web3').eth.accounts.wallet[0].encrypt(config.get('password'))
  const body = JSON.stringify({
    'password': config.get('password'),
    wallet
  })
  await fetch('http://localhost:3000/wallet', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body
  })
}

module.exports = {
  AfterEach,
  BeforeEach,
  Before
}
