const express = require('express')
const unitTypesRouter = express.Router()
const config = require('../../../../config.js')
const { loadAccount } = require('../../../helpers/crypto')
const { validatePassword,
        validateType,
        validateAddImage,
        validateUnitTypeInformation,
        validateAmenity } = require('../../../helpers/validators')

const { handle } = require('../../../../errors')
const {HotelManager} = require('@windingtree/wt-js-libs')

unitTypesRouter.get('/hotels/:address/unitTypes', async (req, res, next) => {
  const { address } = req.params
  try {
    const hotelManager = new HotelManager({
      indexAddress: config.get('indexAddress'),
      gasMargin: config.get('gasMargin'),
      web3: config.get('web3')
    })
    const hotel = await hotelManager.getHotel(address)
    res.status(200).json({
      unitTypes: hotel.unitTypes
    })
  } catch (err) {
    next(handle('web3', err))
  }
})

unitTypesRouter.post('/hotels/:address/unitTypes', validateType, validatePassword, async (req, res, next) => {
  const { password, type } = req.body
  const { address } = req.params
  let ownerAccount = {}
  try {
    ownerAccount = config.get('web3').eth.accounts.decrypt(loadAccount(config.get('privateKeyDir')), password)
    const hotelManager = new HotelManager({
      indexAddress: config.get('indexAddress'),
      gasMargin: config.get('gasMargin'),
      owner: ownerAccount.address,
      web3: config.get('web3')
    })
    hotelManager.web3.eth.accounts.wallet.add(ownerAccount)
    const { logs } = await hotelManager.addUnitType(address, type)
    hotelManager.web3.eth.accounts.wallet.remove(ownerAccount)
    res.status(200).json({
      txHash: logs[0].transactionHash
    })
  } catch (err) {
    next(handle('web3', err))
  }
})

unitTypesRouter.delete('/hotels/:address/unitTypes/:type', validatePassword, async (req, res, next) => {
  const { password } = req.body
  const { address, type } = req.params
  let ownerAccount = {}
  try {
    ownerAccount = config.get('web3').eth.accounts.decrypt(loadAccount(config.get('privateKeyDir')), password)
    const hotelManager = new HotelManager({
      indexAddress: config.get('indexAddress'),
      gasMargin: config.get('gasMargin'),
      owner: ownerAccount.address,
      web3: config.get('web3')
    })
    hotelManager.web3.eth.accounts.wallet.add(ownerAccount)
    const { logs } = await hotelManager.removeUnitType(address, type)
    hotelManager.web3.eth.accounts.wallet.remove(ownerAccount)
    res.status(200).json({
      txHash: logs[0].transactionHash
    })
  } catch (err) {
    next(handle('web3', err))
  }
})

unitTypesRouter.put('/hotels/:address/unitTypes/:type', validateUnitTypeInformation, validatePassword, async (req, res, next) => {
  const { password, description, minGuests, maxGuests, price } = req.body
  const { address, type } = req.params
  let ownerAccount = {}
  try {
    ownerAccount = config.get('web3').eth.accounts.decrypt(loadAccount(config.get('privateKeyDir')), password)
    const hotelManager = new HotelManager({
      indexAddress: config.get('indexAddress'),
      gasMargin: config.get('gasMargin'),
      owner: ownerAccount.address,
      web3: config.get('web3')
    })
    hotelManager.web3.eth.accounts.wallet.add(ownerAccount)
    const { logs } = await hotelManager.editUnitType(address, type, description, minGuests, maxGuests, price)
    hotelManager.web3.eth.accounts.wallet.remove(ownerAccount)
    res.status(200).json({
      txHash: logs[0].transactionHash
    })
  } catch (err) {
    next(handle('web3', err))
  }
})

unitTypesRouter.post('/hotels/:address/unitTypes/:type/images', validatePassword, validateAddImage, async (req, res, next) => {
  const { password, url } = req.body
  const { address, type } = req.params
  let ownerAccount = {}
  try {
    ownerAccount = config.get('web3').eth.accounts.decrypt(loadAccount(config.get('privateKeyDir')), password)
    const hotelManager = new HotelManager({
      indexAddress: config.get('indexAddress'),
      owner: ownerAccount.address,
      gasMargin: config.get('gasMargin'),
      web3: config.get('web3')
    })
    hotelManager.web3.eth.accounts.wallet.add(ownerAccount)
    const { logs } = await hotelManager.addImageUnitType(address, type, url)
    hotelManager.web3.eth.accounts.wallet.remove(ownerAccount)
    res.status(200).json({
      txHash: logs[0].transactionHash
    })
  } catch (err) {
    return next(handle('web3', err))
  }
})

unitTypesRouter.delete('/hotels/:address/unitTypes/:type/images/:id', validatePassword, async (req, res, next) => {
  const { address, id, type } = req.params
  const { password } = req.body
  let ownerAccount = {}
  try {
    ownerAccount = config.get('web3').eth.accounts.decrypt(loadAccount(config.get('privateKeyDir')), password)
    const hotelManager = new HotelManager({
      indexAddress: config.get('indexAddress'),
      owner: ownerAccount.address,
      gasMargin: config.get('gasMargin'),
      web3: config.get('web3')
    })
    hotelManager.web3.eth.accounts.wallet.add(ownerAccount)
    const { logs } = await hotelManager.removeImageUnitType(address, type, id)
    hotelManager.web3.eth.accounts.wallet.remove(ownerAccount)
    res.status(204).json({
      txHash: logs[0].transactionHash
    })
  } catch (err) {
    return next(handle('web3', err))
  }
})

unitTypesRouter.post('/hotels/:address/unitTypes/:type/amenities', validateAmenity, validatePassword, async (req, res, next) => {
  const { password, amenity } = req.body
  const { address, type } = req.params
  let ownerAccount = {}
  try {
    ownerAccount = config.get('web3').eth.accounts.decrypt(loadAccount(config.get('privateKeyDir')), password)
    const hotelManager = new HotelManager({
      indexAddress: config.get('indexAddress'),
      gasMargin: config.get('gasMargin'),
      owner: ownerAccount.address,
      web3: config.get('web3')
    })
    hotelManager.web3.eth.accounts.wallet.add(ownerAccount)
    const { logs } = await hotelManager.addAmenity(address, type, amenity)
    hotelManager.web3.eth.accounts.wallet.remove(ownerAccount)
    res.status(200).json({
      txHash: logs[0].transactionHash
    })
  } catch (err) {
    next(handle('web3', err))
  }
})

unitTypesRouter.delete('/hotels/:address/unitTypes/:type/amenities/:amenity', validatePassword, async (req, res, next) => {
  const { password } = req.body
  const { address, type, amenity } = req.params
  let ownerAccount = {}
  try {
    ownerAccount = config.get('web3').eth.accounts.decrypt(loadAccount(config.get('privateKeyDir')), password)
    const hotelManager = new HotelManager({
      indexAddress: config.get('indexAddress'),
      gasMargin: config.get('gasMargin'),
      owner: ownerAccount.address,
      web3: config.get('web3')
    })
    hotelManager.web3.eth.accounts.wallet.add(ownerAccount)
    const { logs } = await hotelManager.removeAmenity(address, type, amenity)
    hotelManager.web3.eth.accounts.wallet.remove(ownerAccount)
    res.status(200).json({
      txHash: logs[0].transactionHash
    })
  } catch (err) {
    next(handle('web3', err))
  }
})

module.exports = {
  unitTypesRouter
}
