
var http = require('http');
var fs = require('fs');
var Web3 = require('web3');
var BookingData = require('./libs/BookingData.js');
var HotelManager = require('./libs/HotelManager.js');
var HotelEvents = require('./libs/HotelEvents.js');
var User = require('./libs/User.js');
var Utils = require('./libs/Utils.js');

const CONFIG = require('./config.json');

console.log('Config:', CONFIG);

var web3 = new Web3(new Web3.providers.HttpProvider(CONFIG.web3Provider));

const privateKeyString = fs.readFileSync(__dirname+CONFIG.privateKeyDir, "utf8");
const privateKeyJSON = JSON.parse(privateKeyString);

console.log('API ETH address:', privateKeyJSON.address);

http.createServer(function (req, res) {
  res.write('WT Nodejs API');
  res.end(); //end the response
}).listen(CONFIG.port);