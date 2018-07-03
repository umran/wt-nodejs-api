const express = require('express');
const {
  injectWtLibs,
} = require('../middlewares');
const AddressValidators = require('../middlewares/addresses.js');
const hotelsController = require('../controllers/hotels');

const HOTEL_ROUTE = '/hotels/:hotelAddress';
const HOTELS_ROUTE = '/hotels';
const hotelsRouter = express.Router();

hotelsRouter.get(HOTELS_ROUTE, injectWtLibs, hotelsController.findAll);

hotelsRouter.get(HOTEL_ROUTE, injectWtLibs, AddressValidators.hotelAddress, hotelsController.find);

module.exports = {
  hotelsRouter,
};
