const fs = require('fs')
const Web3 = require('web3')
const CONFIG = require('../../config.json')

const web3 = new Web3(new Web3.providers.HttpProvider(CONFIG.web3Provider))

function loadAccount (dir) {
  let privateKeyString = fs.readFileSync(dir, 'utf8')
  return JSON.parse(privateKeyString)
}

function updateAccount (oldPassword, newPassword, privateKeyJSON, writeTo = CONFIG.privateKeyDir) {
  if (!newPassword) newPassword = oldPassword
  const { privateKey } = web3.eth.accounts.decrypt(privateKeyJSON, oldPassword)
  console.log(typeof privateKey, privateKey)
  console.log(newPassword)
  const cryptedAccount = web3.eth.accounts.encrypt(privateKey, newPassword)
  fs.writeFileSync(writeTo, JSON.stringify(cryptedAccount), 'utf8')
}

module.exports = {
  loadAccount,
  updateAccount
}
