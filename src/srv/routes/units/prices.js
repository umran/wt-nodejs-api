const express = require('express')
const pricesRouter = express.Router()
const { loadAccount } = require('../../../helpers/crypto')
const { validatePassword,
        validatePrice,
        validateCode,
        validateCost,
        validateDateRange } = require('../../../helpers/validators')

const { handle } = require('../../../../errors')
const HotelManager = require('../../../../wt-js-libs/dist/node/HotelManager.js')
const User = require('../../../../wt-js-libs/dist/node/User.js')
const BookingData = require('../../../../wt-js-libs/dist/node/BookingData.js')

const config = require('../../../../config.js')

pricesRouter.post([
  '/hotels/:address/unitTypes/:type/units/:unit/defaultPrice',
  '/hotels/:address/units/:unit/defaultPrice'
], validatePassword, validatePrice,
async (req, res, next) => {
  const { password, price } = req.body
  const { address, unit } = req.params
  let ownerAccount = {}
  try {
    let context = {
      indexAddress: config.get('indexAddress'),
      gasMargin: config.get('gasMargin'),
      web3: config.get('web3')
    }
    ownerAccount = config.get('web3').eth.accounts.decrypt(loadAccount(config.get('privateKeyDir')), password)
    context.owner = ownerAccount.address
    const hotelManager = new HotelManager(context)
    hotelManager.web3.eth.accounts.wallet.add(ownerAccount)
    await hotelManager.setDefaultPrice(address, unit, price)
    hotelManager.web3.eth.accounts.wallet.remove(ownerAccount)
    res.status(200).json({
      txHash: true// logs[0].transactionHash
    })
  } catch (err) {
    next(handle('web3', err))
  }
})

pricesRouter.post([
  '/hotels/:address/unitTypes/:type/units/:unit/defaultLifPrice',
  '/hotels/:address/units/:unit/defaultLifPrice'
], validatePassword, validatePrice,
async (req, res, next) => {
  const { password, price } = req.body
  const { address, unit } = req.params
  let ownerAccount = {}
  try {
    let context = {
      indexAddress: config.get('indexAddress'),
      gasMargin: config.get('gasMargin'),
      web3: config.get('web3')
    }
    ownerAccount = config.get('web3').eth.accounts.decrypt(loadAccount(config.get('privateKeyDir')), password)
    context.owner = ownerAccount.address
    const hotelManager = new HotelManager(context)
    hotelManager.web3.eth.accounts.wallet.add(ownerAccount)
    const {logs} = await hotelManager.setDefaultLifPrice(address, unit, price)
    hotelManager.web3.eth.accounts.wallet.remove(ownerAccount)
    res.status(200).json({
      txHash: logs[0].transactionHash
    })
  } catch (err) {
    next(handle('web3', err))
  }
})

pricesRouter.post([
  '/hotels/:address/unitTypes/:type/units/:unit/currencyCode',
  '/hotels/:address/units/:unit/currencyCode'
], validatePassword, validateCode,
async (req, res, next) => {
  const { password, code } = req.body
  const { address, unit } = req.params
  let ownerAccount = {}
  try {
    let context = {
      indexAddress: config.get('indexAddress'),
      gasMargin: config.get('gasMargin'),
      web3: config.get('web3')
    }
    ownerAccount = config.get('web3').eth.accounts.decrypt(loadAccount(config.get('privateKeyDir')), password)
    context.owner = ownerAccount.address
    const hotelManager = new HotelManager(context)
    hotelManager.web3.eth.accounts.wallet.add(ownerAccount)
    await hotelManager.setCurrencyCode(address, unit, code)
    hotelManager.web3.eth.accounts.wallet.remove(ownerAccount)
    res.status(200).json({
      txHash: true// logs[0].transactionHash
    })
  } catch (err) {
    next(handle('web3', err))
  }
})
pricesRouter.post([
  '/hotels/:address/unitTypes/:type/units/:unit/specialLifPrice',
  '/hotels/:address/units/:unit/specialLifPrice'
], validatePassword, validatePrice,
async (req, res, next) => {
  const { password, price, from, days } = req.body
  const { address, unit } = req.params
  let ownerAccount = {}
  try {
    let context = {
      indexAddress: config.get('indexAddress'),
      gasMargin: config.get('gasMargin'),
      web3: config.get('web3')
    }
    ownerAccount = config.get('web3').eth.accounts.decrypt(loadAccount(config.get('privateKeyDir')), password)
    context.owner = ownerAccount.address
    const hotelManager = new HotelManager(context)
    hotelManager.web3.eth.accounts.wallet.add(ownerAccount)
    const {transactionHash} = await hotelManager.setUnitSpecialLifPrice(address, unit, price, from, days)
    hotelManager.web3.eth.accounts.wallet.remove(ownerAccount)
    res.status(200).json({
      txHash: transactionHash
    })
  } catch (err) {
    next(handle('web3', err))
  }
})

pricesRouter.post([
  '/hotels/:address/unitTypes/:type/units/:unit/specialPrice',
  '/hotels/:address/units/:unit/specialPrice'
], validatePassword, validatePrice,
async (req, res, next) => {
  const { password, price, from, days } = req.body
  const { address, unit } = req.params
  let ownerAccount = {}
  try {
    let context = {
      indexAddress: config.get('indexAddress'),
      gasMargin: config.get('gasMargin'),
      web3: config.get('web3')
    }
    ownerAccount = config.get('web3').eth.accounts.decrypt(loadAccount(config.get('privateKeyDir')), password)
    context.owner = ownerAccount.address
    const hotelManager = new HotelManager(context)
    hotelManager.web3.eth.accounts.wallet.add(ownerAccount)
    const {transactionHash} = await hotelManager.setUnitSpecialPrice(address, unit, price, from, days)
    hotelManager.web3.eth.accounts.wallet.remove(ownerAccount)
    res.status(200).json({
      txHash: transactionHash
    })
  } catch (err) {
    next(handle('web3', err))
  }
})

pricesRouter.get('/units/:unitAdress/cost', validateDateRange, async (req, res, next) => {
  const { from, days } = req.body
  const { unitAdress } = req.params
  try {
    const data = new BookingData(config.get('web3'))
    const cost = await data.getCost(unitAdress, from, days)
    res.status(200).json({cost})
  } catch (err) {
    next(handle('web3', err))
  }
})

pricesRouter.get('/units/:unitAdress/lifCost', validateDateRange, async (req, res, next) => {
  const { from, days } = req.body
  const { unitAdress } = req.params
  try {
    const data = new BookingData(config.get('web3'))
    const cost = await data.getLifCost(unitAdress, from, days)
    res.status(200).json({cost})
  } catch (err) {
    next(handle('web3', err))
  }
})

pricesRouter.get('/balance', validateCost, async (req, res, next) => {
  const { cost, account } = req.body
  try {
    const user = new User({
      account,
      gasMargin: config.get('gasMargin'),
      tokenAddress: config.get('tokenAddress'),
      web3: config.get('web3')
    })
    const balance = await user.balanceCheck(cost)
    res.status(200).json({balance})
  } catch (err) {
    next(handle('web3', err))
  }
})

module.exports = {
  pricesRouter
}
