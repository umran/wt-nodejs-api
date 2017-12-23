const express = require('express')
const amenitiesRouter = express.Router()
const { loadAccount } = require('../../helpers/crypto')
const { validatePassword, validateAmenity } = require('../../helpers/validators')

const { handle } = require('../../../errors')
const HotelManager = require('../../../libs/HotelManager.js')

const config = require('../../../config.js')

amenitiesRouter.post('/hotels/:address/unitTypes/:type/amenities', validateAmenity, validatePassword, async (req, res, next) => {
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

amenitiesRouter.delete('/hotels/:address/unitTypes/:type/amenities/:amenity', validatePassword, async (req, res, next) => {
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
  amenitiesRouter
}
