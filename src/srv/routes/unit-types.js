const Web3 = require('web3')
const express = require('express')
const unitTypesRouter = express.Router()
const CONFIG = require('../../config.json')
const { handle } = require('../../errors')
const HotelManager = require('../../libs/HotelManager.js')

const web3 = new Web3(new Web3.providers.HttpProvider(CONFIG.web3Provider))
let context = {
  indexAddress: CONFIG.indexAddress,
  gasMargin: CONFIG.gasMargin,
  web3: web3
}

unitTypesRouter.get('/hotels/:address/unitTypes', async (req, res, next) => {
  const { address } = req.params
  try {
    const hotelManager = new HotelManager(context)
    const hotel = await hotelManager.getHotel(address)
    res.status(200).json({
      unitTypes: hotel.unitTypes
    })
  } catch (err) {
    next(handle('web3', err))
  }
})

module.exports = {
  unitTypesRouter
}
