const express = require('express')
const {router} = require('./routes')
const fs = require('fs');
const Web3 = require('web3');
const bodyParser = require('body-parser');

const BookingData = require('../../libs/BookingData.js');
const HotelManager = require('../../libs/HotelManager.js');
const HotelEvents = require('../../libs/HotelEvents.js');
const User = require('../../libs/User.js');
const Utils = require('../../libs/Utils.js');

const CONFIG = require('../../config.json');
const web3 = new Web3(new Web3.providers.HttpProvider(CONFIG.web3Provider));

const privateKeyString = fs.readFileSync(`${CONFIG.privateKeyDir}`, "utf8");
const privateKeyJSON = JSON.parse(privateKeyString);

const app = express()

app.use(bodyParser.json())
app.use(router)
app.use((err, req, res, next) => {
  console.error(err)
  res.sendStatus(400).json(err)
})

app.listen(3000, () => {
  console.log('WT API AT 3000!')
})
