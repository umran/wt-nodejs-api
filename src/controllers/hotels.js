const { handleApplicationError } = require('../errors');
const {
  DEFAULT_HOTELS_STRING,
  DEFAULT_HOTEL_STRING } = require('../constants.js');
const {
  fetchHotel,
  calculateFields,
} = require('../services/filter-responses');

const { mapHotel } = require('../services/mappings.js');

const findAll = async (req, res, next) => {
  const fieldsQuery = req.query.fields || DEFAULT_HOTELS_STRING;
  const fields = await calculateFields(fieldsQuery);
  try {
    let hotels = await res.locals.wt.index.getAllHotels();
    let rawHotels = [];
    for (let hotel of hotels) {
      rawHotels.push(fetchHotel(hotel, fields));
    }
    rawHotels = await Promise.all(rawHotels);
    let items = rawHotels.map(hotel => mapHotel(hotel));
    items = await Promise.all(items);
    res.status(200).json({ items });
  } catch (e) {
    next(e);
  }
};

const find = async (req, res, next) => {
  const { hotelAddress } = req.params;
  const fieldsQuery = req.query.fields || DEFAULT_HOTEL_STRING;
  const fields = await calculateFields(fieldsQuery);
  try {
    let hotel = await res.locals.wt.index.getHotel(hotelAddress);
    hotel = await fetchHotel(hotel, fields);
    hotel = await mapHotel(hotel);
    res.status(200).json({ hotel });
  } catch (e) {
    if (e.message.match(/cannot find hotel/i)) {
      return next(handleApplicationError('hotelNotFound', e));
    }
    next(e);
  }
};

module.exports = {
  find,
  findAll,
};
