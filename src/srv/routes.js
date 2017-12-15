const Web3 = require('web3')
const express = require('express')
const router = express.Router()
const CONFIG = require('../../config.json')
const { loadAccount, updateAccountPassword } = require('../helpers/crypto')
const { validateAddImage,
        validatePasswords,
        validatePassword,
        validateCreateHotel
      } = require('../helpers/validators')

const { handle } = require('../../errors')
const BookingData = require('../../libs/BookingData.js')
const HotelManager = require('../../libs/HotelManager.js')
const HotelEvents = require('../../libs/HotelEvents.js')
const User = require('../../libs/User.js')
const Utils = require('../../libs/Utils.js')

const web3 = new Web3(new Web3.providers.HttpProvider(CONFIG.web3Provider))

router.get('/', (req, res) => {
  res.write('WT Nodejs API')
  res.end()
})

router.post('/password', validatePasswords, (req, res, next) => {
  const { password, newPassword } = req.body
  try {
    updateAccountPassword(password, newPassword, loadAccount(CONFIG.privateKeyDir))
  } catch (err) {
    return next(handle('web3', err))
  }
  res.sendStatus(200)
})

router.get('/hotels', validatePassword, async (req, res, next) => {
  const { password } = req.body
  let ownerAccount = {}
  try {
    ownerAccount = web3.eth.accounts.decrypt(loadAccount(CONFIG.privateKeyDir), password)
  } catch (err) {
    return next(handle('web3', err))
  }
  try {
    const hotelManager = new HotelManager({
      indexAddress: CONFIG.indexAddress,
      owner: ownerAccount.address,
      gasMargin: CONFIG.gasMargin,
      web3: web3
    })
    const hotels = await hotelManager.getHotels()
    res.status(200).json(hotels)
  } catch (err) {
    return next(handle('hotelManager', err))
  }
})

router.post('/hotels', validateCreateHotel, async (req, res, next) => {
  const { password, name, description } = req.body
  let ownerAccount = {}
  try {
    ownerAccount = web3.eth.accounts.decrypt(loadAccount(CONFIG.privateKeyDir), password)
    const hotelManager = new HotelManager({
      indexAddress: CONFIG.indexAddress,
      owner: ownerAccount.address,
      gasMargin: CONFIG.gasMargin,
      web3: web3
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

router.post('/hotels/:address/images', validatePassword, validateAddImage, async (req, res, next) => {
  const { password, url } = req.body
  const { address } = req.params
  let ownerAccount = {}
  try {
    ownerAccount = web3.eth.accounts.decrypt(loadAccount(CONFIG.privateKeyDir), password)
    const hotelManager = new HotelManager({
      indexAddress: CONFIG.indexAddress,
      owner: ownerAccount.address,
      gasMargin: CONFIG.gasMargin,
      web3: web3
    })
    hotelManager.web3.eth.accounts.wallet.add(ownerAccount)
    const { logs } = await hotelManager.addImageHotel(address, url)
    hotelManager.web3.eth.accounts.wallet.remove(ownerAccount)
    res.status(200).json({
      txHash: logs[0].transactionHash
    })
  } catch (err) {
    return next(handle('web3', err))
  }
})

router.get('/hotels/:address/images', async (req, res, next) => {
  const { address } = req.params
  try {
    const images = []
    const context = {
      indexAddress: CONFIG.indexAddress,
      gasMargin: CONFIG.gasMargin,
      web3: web3
    }
    const hotelInstance = Utils.getInstance('Hotel', address, context)
    const totalImages = await hotelInstance.methods.getImagesLength().call()
    for (var i = 0; i < totalImages; i++) {
      images.push(await hotelInstance.methods.images(i).call())
    }
    res.status(200).json({
      images
    })
  } catch (err) {
    return next(handle('web3', err))
  }
})

module.exports = {
  router
}
