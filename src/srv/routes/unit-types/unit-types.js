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
const HotelManager = require('../../../../wt-js-libs/dist/node/HotelManager.js')

unitTypesRouter.get('/hotels/:hotelAddress/unitTypes', async (req, res, next) => {
  const {hotelAddress } = req.params
  try {
    const hotelManager = new HotelManager({
      indexAddress: config.get('indexAddress'),
      gasMargin: config.get('gasMargin'),
      web3: config.get('web3')
    })
    const hotel = await hotelManager.getHotel(hotelAddress)
    res.status(200).json({
      unitTypes: hotel.unitTypes
    })
  } catch (err) {
    next(handle('web3', err))
  }
})

unitTypesRouter.post('/hotels/:hotelAddress/unitTypes', validateType, validatePassword, async (req, res, next) => {
  const { password, type } = req.body
  const {hotelAddress } = req.params
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
    const { logs } = await hotelManager.addUnitType(hotelAddress, type)
    hotelManager.web3.eth.accounts.wallet.remove(ownerAccount)
    res.status(200).json({
      txHash: logs[0].transactionHash
    })
  } catch (err) {
    next(handle('web3', err))
  }
})

unitTypesRouter.delete('/hotels/:hotelAddress/unitTypes/:type', validatePassword, async (req, res, next) => {
  const { password } = req.body
  const { hotelAddress, type } = req.params
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
    const { logs } = await hotelManager.removeUnitType(hotelAddress, type)
    hotelManager.web3.eth.accounts.wallet.remove(ownerAccount)
    res.status(200).json({
      txHash: logs[0].transactionHash
    })
  } catch (err) {
    next(handle('web3', err))
  }
})

unitTypesRouter.put('/hotels/:hotelAddress/unitTypes/:type', validateUnitTypeInformation, validatePassword, async (req, res, next) => {
  const { password, description, minGuests, maxGuests, price } = req.body
  const { hotelAddress, type } = req.params
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
    const { logs } = await hotelManager.editUnitType(hotelAddress, type, description, minGuests, maxGuests, price)
    hotelManager.web3.eth.accounts.wallet.remove(ownerAccount)
    res.status(200).json({
      txHash: logs[0].transactionHash
    })
  } catch (err) {
    next(handle('web3', err))
  }
})

unitTypesRouter.post('/hotels/:hotelAddress/unitTypes/:type/images', validatePassword, validateAddImage, async (req, res, next) => {
  const { password, url } = req.body
  const { hotelAddress, type } = req.params
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
    const { logs } = await hotelManager.addImageUnitType(hotelAddress, type, url)
    hotelManager.web3.eth.accounts.wallet.remove(ownerAccount)
    res.status(200).json({
      txHash: logs[0].transactionHash
    })
  } catch (err) {
    return next(handle('web3', err))
  }
})

unitTypesRouter.delete('/hotels/:hotelAddress/unitTypes/:type/images/:id', validatePassword, async (req, res, next) => {
  const { hotelAddress, id, type } = req.params
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
    const { logs } = await hotelManager.removeImageUnitType(hotelAddress, type, id)
    hotelManager.web3.eth.accounts.wallet.remove(ownerAccount)
    res.status(204).json({
      txHash: logs[0].transactionHash
    })
  } catch (err) {
    return next(handle('web3', err))
  }
})

unitTypesRouter.post('/hotels/:hotelAddress/unitTypes/:type/amenities', validateAmenity, validatePassword, async (req, res, next) => {
  const { password, amenity } = req.body
  const { hotelAddress, type } = req.params
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
    const { logs } = await hotelManager.addAmenity(hotelAddress, type, amenity)
    hotelManager.web3.eth.accounts.wallet.remove(ownerAccount)
    res.status(200).json({
      txHash: logs[0].transactionHash
    })
  } catch (err) {
    next(handle('web3', err))
  }
})

unitTypesRouter.delete('/hotels/:hotelAddress/unitTypes/:type/amenities/:amenity', validatePassword, async (req, res, next) => {
  const { password } = req.body
  const { hotelAddress, type, amenity } = req.params
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
    const { logs } = await hotelManager.removeAmenity(hotelAddress, type, amenity)
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
