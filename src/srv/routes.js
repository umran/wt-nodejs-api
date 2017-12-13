const express = require('express')
const router = express.Router()
const CONFIG = require('../../config.json')
const { loadAccount, updateAccountPassword } = require('../helpers/crypto')
const { validatePasswords } = require('../helpers/validators')

router.get('/', (req, res) => {
  res.write('WT Nodejs API')
  res.end()
})

router.post('/password', validatePasswords, (req, res, next) => {
  const { password, newPassword } = req.body
  try {
    updateAccountPassword(password, newPassword, loadAccount(CONFIG.privateKeyDir))
  } catch (err) {
    return next({code: 'web3', err})
  }
  res.sendStatus(200)
})

module.exports = {
  router
}
