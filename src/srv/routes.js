const express = require('express');
const router = express.Router();
const fs = require('fs');
const CONFIG = require('../../config.json')
const { loadAccount, updateAccountPassword } = require('../helpers/crypto')

router.get('/', (req, res) => {
  res.write('WT Nodejs API');
  res.end();
})

router.post('/password', (req, res, next) => {
  const { password, newPassword } = req.body
  try {
    updateAccountPassword(password, newPassword, loadAccount(CONFIG.privateKeyDir))
  } catch (e) {
    return next(e)
  }
  res.sendStatus(200)
})

module.exports = {
  router
}
