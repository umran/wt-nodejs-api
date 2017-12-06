
const http = require('http');
const fs = require('fs');
const Web3 = require('web3');
const BookingData = require('./libs/BookingData.js');
const HotelManager = require('./libs/HotelManager.js');
const HotelEvents = require('./libs/HotelEvents.js');
const User = require('./libs/User.js');
const Utils = require('./libs/Utils.js');

const CONFIG = require('./config.json');

console.log('Config:', CONFIG);

const web3 = new Web3(new Web3.providers.HttpProvider(CONFIG.web3Provider));

const privateKeyString = fs.readFileSync(__dirname+CONFIG.privateKeyDir, "utf8");
const privateKeyJSON = JSON.parse(privateKeyString);

console.log('API ETH address:', privateKeyJSON.address);

http.createServer(function (req, res) {
  res.write('WT Nodejs API');
  res.end(); //end the response
}).listen(CONFIG.port);
