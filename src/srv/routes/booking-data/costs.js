const express = require('express')
const costsRouter = express.Router()
const { validateDateRange } = require('../../../helpers/validators')
const { handle } = require('../../../../errors')
const BookingData = require('../../../../wt-js-libs/dist/node/BookingData.js')
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

module.exports = {
  costsRouter
}
