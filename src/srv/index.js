const express = require('express')
const {router} = require('./routes')
const fs = require('fs');
const Web3 = require('web3');
const BookingData = require('../../libs/BookingData.js');
const HotelManager = require('../../libs/HotelManager.js');
const HotelEvents = require('../../libs/HotelEvents.js');
const User = require('../../libs/User.js');
const Utils = require('../../libs/Utils.js');

const CONFIG = require('../../config.json');

console.log('Config:', CONFIG);

const web3 = new Web3(new Web3.providers.HttpProvider(CONFIG.web3Provider));

const privateKeyString = fs.readFileSync(`${CONFIG.privateKeyDir}`, "utf8");
const privateKeyJSON = JSON.parse(privateKeyString);

console.log('API ETH address:', privateKeyJSON.address);

const app = express()
app.use(router)

app.use((err, req, res, next) => {
  console.error(err)
  res.status(400).json(err)
})

app.listen(3000, () => {
  console.log('WT API AT 3000!')
})
