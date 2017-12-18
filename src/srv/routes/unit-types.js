const Web3 = require('web3')
const express = require('express')
const unitTypesRouter = express.Router()
const CONFIG = require('../../config.json')
const { loadAccount } = require('../helpers/crypto')
const { validatePassword } = require('../helpers/validators')

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

unitTypesRouter.post('/hotels/:address/unitTypes', validatePassword, async (req, res, next) => {
  const { password, unitType } = req.body
  const { address } = req.params
  let ownerAccount = {}
  try {
    ownerAccount = web3.eth.accounts.decrypt(loadAccount(CONFIG.privateKeyDir), password)
    context.owner = ownerAccount.addres
    const hotelManager = new HotelManager(context)
    hotelManager.web3.eth.accounts.wallet.add(ownerAccount)
    const { logs } = await hotelManager.addUnitType(address, unitType)
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
  unitTypesRouter
}
