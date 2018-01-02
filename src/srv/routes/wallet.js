const express = require('express')
const walletRouter = express.Router()
const fs = require('fs')
const {
  loadAccount,
  updateAccount,
  storeWallet
} = require('../../helpers/crypto')
const {
        validatePasswords,
        validatePassword,
        validateWallet
      } = require('../../helpers/validators')

const { handle } = require('../../../errors')
const CONFIG = require('../../../config.json')
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider(CONFIG.web3Provider))

walletRouter.post('/wallet', validatePassword, validateWallet, (req, res, next) => {
  const {wallet, password} = req.body
  try {
    web3.eth.accounts.decrypt(wallet, password)
    storeWallet(wallet)
  } catch (err) {
    return next(handle('web3', err))
  }
  res.sendStatus(200)
})

walletRouter.get('/wallet', validatePassword, (req, res, next) => {
  const { password } = req.body
  let wallet
  try {
    wallet = web3.eth.accounts.decrypt(loadAccount(CONFIG.privateKeyDir), password)
  } catch (err) {
    return next(handle('web3', err))
  }
  res.status(200).json({
    wallet
  })
})

walletRouter.put('/wallet/password', validatePasswords, (req, res, next) => {
  const { password, newPassword } = req.body
  try {
    updateAccount(password, newPassword, loadAccount(CONFIG.privateKeyDir))
  } catch (err) {
    return next(handle('web3', err))
  }
  res.sendStatus(200)
})

walletRouter.delete('/wallet', validatePassword, (req, res, next) => {
  const { password } = req.body
  try {
    web3.eth.accounts.decrypt(loadAccount(CONFIG.privateKeyDir), password)
  } catch (err) {
    return next(handle('web3', err))
  }
  fs.unlinkSync(CONFIG.privateKeyDir)
  res.sendStatus(204)
})

module.exports = {
  walletRouter
}
