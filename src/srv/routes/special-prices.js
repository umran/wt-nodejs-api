const express = require('express')
const specialPricesRouter = express.Router()
const { loadAccount } = require('../../helpers/crypto')
const { validatePassword,
        validatePrice } = require('../../helpers/validators')

const { handle } = require('../../../errors')
const HotelManager = require('../../../wt-js-libs/dist/node/HotelManager.js')

const config = require('../../../config.js')

specialPricesRouter.post([
  '/hotels/:address/unitTypes/:type/units/:unit/specialLifPrice',
  '/hotels/:address/units/:unit/specialLifPrice'
], validatePassword, validatePrice,
async (req, res, next) => {
  const { password, price, from, days } = req.body
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
    const {transactionHash} = await hotelManager.setUnitSpecialLifPrice(address, unit, price, from, days)
    hotelManager.web3.eth.accounts.wallet.remove(ownerAccount)
    res.status(200).json({
      txHash: transactionHash
    })
  } catch (err) {
    next(handle('web3', err))
  }
})

specialPricesRouter.post([
  '/hotels/:address/unitTypes/:type/units/:unit/specialPrice',
  '/hotels/:address/units/:unit/specialPrice'
], validatePassword, validatePrice,
async (req, res, next) => {
  const { password, price, from, days } = req.body
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
    const {transactionHash} = await hotelManager.setUnitSpecialPrice(address, unit, price, from, days)
    hotelManager.web3.eth.accounts.wallet.remove(ownerAccount)
    res.status(200).json({
      txHash: transactionHash
    })
  } catch (err) {
    next(handle('web3', err))
  }
})

module.exports = {
  specialPricesRouter
}
