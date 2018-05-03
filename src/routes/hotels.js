const express = require('express');
const {
  injectWtLibs,
  unlockAccount,
  wipeAccountFromMemory,
} = require('../middlewares');
const hotelsController = require('../controllers/hotels');

const HOTEL_ROUTE = '/hotels/:hotelAddress';
const HOTELS_ROUTE = '/hotels';
const hotelsRouter = express.Router();

// Read only methods
hotelsRouter.get(HOTELS_ROUTE, injectWtLibs, hotelsController.findAll);

hotelsRouter.get(HOTEL_ROUTE, injectWtLibs, hotelsController.find);

// Data modifying methods
hotelsRouter.post(HOTELS_ROUTE, unlockAccount, wipeAccountFromMemory, hotelsController.create);

hotelsRouter.put(HOTEL_ROUTE, unlockAccount, wipeAccountFromMemory, hotelsController.update);

hotelsRouter.delete(HOTEL_ROUTE, unlockAccount, wipeAccountFromMemory, hotelsController.remove);

module.exports = {
  hotelsRouter,
};
