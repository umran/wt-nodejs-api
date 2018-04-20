const express = require('express');
const hotelsRouter = express.Router();
const {
  validatePassword,
  // validateHotelInfo,
} = require('../helpers/validators');
const hotels = require('../controllers/hotels');

const hotelRoute = '/hotels/:hotelAddress';
const hotelsRoute = '/hotels';

hotelsRouter.post(hotelsRoute, validatePassword, hotels.create);

hotelsRouter.get(hotelsRoute, validatePassword, hotels.findAll);

hotelsRouter.get(hotelRoute, hotels.find);

hotelsRouter.put(hotelRoute, validatePassword, hotels.update);

hotelsRouter.delete(hotelRoute, validatePassword, hotels.remove);

module.exports = {
  hotelsRouter,
};
