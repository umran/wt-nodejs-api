const express = require('express')
const costsRouter = express.Router()
const { validateDateRange,
        validateCost } = require('../../../helpers/validators')
const { handle } = require('../../../../errors')
const BookingData = require('../../../../wt-js-libs/dist/node/BookingData.js')
const User = require('../../../../wt-js-libs/dist/node/User.js')
const config = require('../../../../config.js')

costsRouter.get('/units/:unitAdress/cost', validateDateRange, async (req, res, next) => {
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

costsRouter.get('/units/:unitAdress/lifCost', validateDateRange, async (req, res, next) => {
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

costsRouter.get('/balance', validateCost, async (req, res, next) => {
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
  costsRouter
}
