const Web3 = require('web3')
const express = require('express')
const amenitiesRouter = express.Router()
const CONFIG = require('../../../config.json')
const { loadAccount } = require('../../helpers/crypto')
const { validatePassword, validateAmenity } = require('../../helpers/validators')

const { handle } = require('../../../errors')
const HotelManager = require('../../../libs/HotelManager.js')

const web3 = new Web3(new Web3.providers.HttpProvider(CONFIG.web3Provider))
let context = {
  indexAddress: CONFIG.indexAddress,
  gasMargin: CONFIG.gasMargin,
  web3: web3
}

amenitiesRouter.post('/hotels/:address/unitTypes/:type/amenities', validateAmenity, validatePassword, async (req, res, next) => {
  const { password, amenity } = req.body
  const { address, type } = req.params
  let ownerAccount = {}
  try {
    ownerAccount = web3.eth.accounts.decrypt(loadAccount(CONFIG.privateKeyDir), password)
    context.owner = ownerAccount.address
    const hotelManager = new HotelManager(context)
    hotelManager.web3.eth.accounts.wallet.add(ownerAccount)
    const { logs } = await hotelManager.addAmenity(address, type, amenity)
    hotelManager.web3.eth.accounts.wallet.remove(ownerAccount)
    context.owner = undefined
    res.status(200).json({
      txHash: logs[0].transactionHash
    })
  } catch (err) {
    next(handle('web3', err))
  }
})

amenitiesRouter.delete('/hotels/:address/unitTypes/:type/amenities/:amenity', validatePassword, async (req, res, next) => {
  const { password } = req.body
  const { address, type, amenity } = req.params
  let ownerAccount = {}
  try {
    ownerAccount = web3.eth.accounts.decrypt(loadAccount(CONFIG.privateKeyDir), password)
    context.owner = ownerAccount.address
    const hotelManager = new HotelManager(context)
    hotelManager.web3.eth.accounts.wallet.add(ownerAccount)
    const { logs } = await hotelManager.removeAmenity(address, type, amenity)
    hotelManager.web3.eth.accounts.wallet.remove(ownerAccount)
    context.owner = undefined
    res.status(200).json({
      txHash: logs[0].transactionHash
    })
  } catch (err) {
    next(handle('web3', err))
  }
})

module.exports = {
  amenitiesRouter
}
