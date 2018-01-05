const express = require('express')
const hotelBookingRouter = express.Router()
const { loadAccount } = require('../../helpers/crypto')
const { validatePassword, validateReservationId } = require('../../helpers/validators')

const { handle } = require('../../../errors')
const HotelManager = require('../../../libs/HotelManager.js')

const config = require('../../../config.js')

hotelBookingRouter.post('/hotels/:address/confirmBooking',
validatePassword, validateReservationId,
async(req, res, next) => {
  const { password, reservationId } = req.body
  const { address } = req.params
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
    const { logs } = await hotelManager.confirmBooking(address, reservationId)
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
  hotelBookingRouter
}
