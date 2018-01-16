const express = require('express')
const defaultPricesRouter = express.Router()
const { loadAccount } = require('../../helpers/crypto')
const { validatePassword,
        validatePrice,
        validateCode } = require('../../helpers/validators')

const { handle } = require('../../../errors')
const HotelManager = require('../../../wt-js-libs/dist/node/HotelManager.js')

const config = require('../../../config.js')

defaultPricesRouter.post([
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
    context.owner = undefined
    res.status(200).json({
      txHash: true// logs[0].transactionHash
    })
  } catch (err) {
    next(handle('web3', err))
  }
})

defaultPricesRouter.post([
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
    context.owner = undefined
    res.status(200).json({
      txHash: logs[0].transactionHash
    })
  } catch (err) {
    next(handle('web3', err))
  }
})

defaultPricesRouter.post([
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
    context.owner = undefined
    res.status(200).json({
      txHash: true// logs[0].transactionHash
    })
  } catch (err) {
    next(handle('web3', err))
  }
})

module.exports = {
  defaultPricesRouter
}
