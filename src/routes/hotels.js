const express = require('express');
const hotelsRouter = express.Router();
const {
  validatePassword,
  // validateHotelInfo,
} = require('../helpers/validators');
const { accountLoader } = require('../middlewares/accounts');
const hotels = require('../controllers/hotels');

const hotelRoute = '/hotels/:hotelAddress';
const hotelsRoute = '/hotels';

hotelsRouter.post(hotelsRoute, validatePassword, accountLoader, hotels.create);

hotelsRouter.get(hotelsRoute, hotels.findAll);

hotelsRouter.get(hotelRoute, hotels.find);

hotelsRouter.put(hotelRoute, validatePassword, accountLoader, hotels.update);

hotelsRouter.delete(hotelRoute, validatePassword, accountLoader, hotels.remove);

module.exports = {
  hotelsRouter,
};
