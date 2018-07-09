const express = require('express');
const {
  injectWtLibs,
} = require('../middlewares');
const AddressValidators = require('../middlewares/addresses.js');
const roomTypesController = require('../controllers/room-types.js');

const ROOM_TYPES_ROUTE = '/hotels/:hotelAddress/roomTypes';
const ROOM_TYPE_ROUTE = '/hotels/:hotelAddress/roomTypes/:roomTypeId';

const roomTypesRouter = express.Router();

roomTypesRouter.get(ROOM_TYPES_ROUTE, injectWtLibs, AddressValidators.hotelAddress, roomTypesController.findAll);
roomTypesRouter.get(ROOM_TYPE_ROUTE, injectWtLibs, AddressValidators.hotelAddress, roomTypesController.find);

module.exports = {
  roomTypesRouter,
};
