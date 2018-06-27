const express = require('express');
const {
  injectWtLibs,
} = require('../middlewares');
const hotelsController = require('../controllers/hotels');

const HOTEL_ROUTE = '/hotels/:hotelAddress';
const HOTELS_ROUTE = '/hotels';
const hotelsRouter = express.Router();

hotelsRouter.get(HOTELS_ROUTE, injectWtLibs, hotelsController.findAll);

hotelsRouter.get(HOTEL_ROUTE, injectWtLibs, hotelsController.find);

module.exports = {
  hotelsRouter,
};
