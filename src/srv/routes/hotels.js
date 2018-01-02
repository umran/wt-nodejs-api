const express = require('express')
const hotelsRouter = express.Router()
const { loadAccount } = require('../../helpers/crypto')
const { validatePassword,
        validateCreateHotel
      } = require('../../helpers/validators')
const { handle } = require('../../../errors')
const HotelManager = require('../../../libs/HotelManager.js')
const config = require('../../../config.js')

hotelsRouter.get('/hotels', validatePassword, async (req, res, next) => {
  const { password } = req.body
  let ownerAccount = {}
  try {
    ownerAccount = config.get('web3').eth.accounts.decrypt(loadAccount(config.get('privateKeyDir')), password)
  } catch (err) {
    return next(handle('web3', err))
  }
  try {
    const hotelManager = new HotelManager({
      indexAddress: config.get('indexAddress'),
      owner: ownerAccount.address,
      gasMargin: config.get('gasMargin'),
      web3: config.get('web3')
    })
    const hotels = await hotelManager.getHotels()
    res.status(200).json(hotels)
  } catch (err) {
    return next(handle('hotelManager', err))
  }
})

hotelsRouter.post('/hotels', validateCreateHotel, async (req, res, next) => {
  const { password, name, description } = req.body
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
    const { logs } = await hotelManager.createHotel(name, description)
    hotelManager.web3.eth.accounts.wallet.remove(ownerAccount)
    res.status(200).json({
      txHash: logs[0].transactionHash
    })
  } catch (err) {
    return next(handle('web3', err))
  }
})

module.exports = {
  hotelsRouter
}
