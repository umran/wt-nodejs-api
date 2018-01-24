const express = require('express')
const unitsRouter = express.Router()
const config = require('../../../config.js')
const { loadAccount } = require('../../helpers/crypto')
const { validatePassword,
        validateActive,
        validateDate,
        validateDateRange } = require('../../helpers/validators')

const { handle } = require('../../../errors')
const HotelManager = require('../../../wt-js-libs/dist/node/HotelManager.js')
const BookingData = require('../../../wt-js-libs/dist/node/BookingData.js')
const User = require('../../../wt-js-libs/dist/node/User.js')

unitsRouter.post('/hotels/:address/unitTypes/:type/units', validatePassword, async (req, res, next) => {
  const { password } = req.body
  const { address, type } = req.params
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
    const { logs } = await hotelManager.addUnit(address, type)
    hotelManager.web3.eth.accounts.wallet.remove(ownerAccount)
    context.owner = undefined
    res.status(200).json({
      txHash: logs[0].transactionHash
    })
  } catch (err) {
    next(handle('web3', err))
  }
})

unitsRouter.delete([
  '/hotels/:address/unitTypes/:type/units/:unit',
  '/hotels/:address/units/:unit'
], validatePassword, async (req, res, next) => {
  const { password } = req.body
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
    const { logs } = await hotelManager.removeUnit(address, unit)
    hotelManager.web3.eth.accounts.wallet.remove(ownerAccount)
    context.owner = undefined
    res.status(200).json({
      txHash: logs[0].transactionHash
    })
  } catch (err) {
    next(handle('web3', err))
  }
})

unitsRouter.put([
  '/hotels/:address/unitTypes/:type/units/:unit/active',
  '/hotels/:address/units/:unit/active'
], validatePassword, validateActive,
async (req, res, next) => {
  const { password, active } = req.body
  const { address, unit } = req.params
  let ownerAccount = {}
  try {
    let context = {
      indexAddress: config.get('indexAddress'),
      gasMargin: config.get('gasMargin'),
      web3: config.get('web3')
    }
    ownerAccount = config.get('web3').eth.accounts.decrypt(loadAccount(config.get('privateKeyDir'), password))
    context.owner = ownerAccount.address
    const hotelManager = new HotelManager(context)
    hotelManager.web3.eth.accounts.wallet.add(ownerAccount)
    const {logs} = await hotelManager.setUnitActive(address, unit, active)
    hotelManager.web3.eth.accounts.wallet.remove(ownerAccount)
    context.owner = undefined
    res.status(200).json({
      txHash: logs[0].transactionHash
    })
  } catch (err) {
    next(handle('web3', err))
  }
})

unitsRouter.get('/units/:unit/reservation', validateDate, async (req, res, next) => {
  const { date } = req.body
  const { unit } = req.params
  try {
    let context = {
      indexAddress: config.get('indexAddress'),
      gasMargin: config.get('gasMargin'),
      web3: config.get('web3')
    }
    const hotelManager = new HotelManager(context)
    const reservation = await hotelManager.getReservation(unit, date)
    context.owner = undefined
    res.status(200).json({
      reservation
    })
  } catch (err) {
    next(handle('web3', err))
  }
})

unitsRouter.get('/units/:unitAdress/available', validateDateRange, async (req, res, next) => {
  const { from, days } = req.body
  const { unitAdress } = req.params
  try {
    const data = new BookingData(config.get('web3'))
    const available = await data.unitIsAvailable(unitAdress, from, days)
    res.status(200).json({available})
  } catch (err) {
    next(handle('web3', err))
  }
})

unitsRouter.post('/hotels/:hotelAddress/units/:unitAddress/book',
validateDateRange, async(req, res, next) => {
  const { guest, from, days, account } = req.body
  const { hotelAddress, unitAddress } = req.params
  try {
    const user = new User({
      account,
      gasMargin: config.get('gasMargin'),
      tokenAddress: config.get('tokenAddress'),
      web3: config.get('web3')
    })
    const {transactionHash} = await user.book(hotelAddress, unitAddress, from, days, guest)
    res.status(200).json({
      txHash: transactionHash
    })
  } catch (err) {
    next(handle('web3', err))
  }
})

unitsRouter.post('/hotels/:hotelAddress/units/:unitAddress/lifBook',
validateDateRange, async(req, res, next) => {
  const { guest, from, days, account } = req.body
  const { hotelAddress, unitAddress } = req.params
  try {
    const user = new User({
      account,
      gasMargin: config.get('gasMargin'),
      tokenAddress: config.get('tokenAddress'),
      web3: config.get('web3')
    })
    const {transactionHash} = await user.bookWithLif(hotelAddress, unitAddress, from, days, guest)
    res.status(200).json({
      txHash: transactionHash
    })
  } catch (err) {
    next(handle('web3', err))
  }
})

module.exports = {
  unitsRouter
}
