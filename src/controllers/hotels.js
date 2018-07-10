const { handleApplicationError } = require('../errors');
const {
  DEFAULT_HOTELS_FIELDS,
  DEFAULT_HOTEL_FIELDS,
} = require('../constants');
const {
  fetchHotel,
  calculateFields,
} = require('../services/filter-responses');

const { mapHotel } = require('../services/mappings');
const { paginate } = require('../services/pagination');

const findAll = async (req, res, next) => {
  const { limit, page } = req.query;
  const fieldsQuery = req.query.fields || DEFAULT_HOTELS_FIELDS;
  const fields = await calculateFields(fieldsQuery);

  try {
    let hotels = await res.locals.wt.index.getAllHotels();

    let { items, next } = paginate(hotels, limit, page);
    let rawHotels = [];
    for (let hotel of items) {
      rawHotels.push(fetchHotel(hotel, fields));
    }
    rawHotels = await Promise.all(rawHotels);
    items = rawHotels.map(hotel => mapHotel(hotel));
    items = await Promise.all(items);
    res.status(200).json({ items, next });
  } catch (e) {
    if (e.message.match(/limit and page are not numbers/i)) {
      return next(handleApplicationError('paginationFormat', e));
    }
    if (e.message.match(/Limit out of range/i)) {
      return next(handleApplicationError('limitRange', e));
    }
    if (e.message.match(/Pagination outside of the limits./i)) {
      return next(handleApplicationError('paginationLimit', e));
    }
    if (e.message.match(/Negative Page./i)) {
      return next(handleApplicationError('negativePage', e));
    }
    next(e);
  }
};

const find = async (req, res, next) => {
  let { hotelAddress } = req.params;
  const fieldsQuery = req.query.fields || DEFAULT_HOTEL_FIELDS;
  const { wt } = res.locals;
  const fields = await calculateFields(fieldsQuery);
  try {
    let hotel = await wt.index.getHotel(hotelAddress);
    hotel = await fetchHotel(hotel, fields);
    hotel = await mapHotel(hotel);
    res.status(200).json(hotel);
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
