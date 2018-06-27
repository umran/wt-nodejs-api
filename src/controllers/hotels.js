const { handleApplicationError } = require('../errors');
const {
  fetchHotel,
  calculateFields,
} = require('../services/filter-responses');

const findAll = async (req, res, next) => {
  const fieldsQuery = req.query.fields || '';
  const fields = calculateFields(fieldsQuery);
  try {
    let hotels = await res.locals.wt.index.getAllHotels();
    let rawHotels = [];
    for (let hotel of hotels) {
      rawHotels.push(fetchHotel(hotel, fields));
    }
    rawHotels = await Promise.all(rawHotels);
    res.status(200).json({ hotels: rawHotels });
  } catch (e) {
    next(e);
  }
};

const find = async (req, res, next) => {
  const { hotelAddress } = req.params;
  const fieldsQuery = req.query.fields || '';

  const fields = calculateFields(fieldsQuery);
  try {
    let hotel = await res.locals.wt.index.getHotel(hotelAddress);
    res.status(200).json({ hotel: await fetchHotel(hotel, fields) });
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
