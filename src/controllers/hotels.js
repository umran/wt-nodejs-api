const _ = require('lodash');
const { handleApplicationError } = require('../errors');
const {
  DEFAULT_HOTELS_FIELDS,
  DEFAULT_HOTEL_FIELDS,
  OBLIGATORY_FIELDS,
  HOTEL_FIELDS,
  DESCRIPTION_FIELDS,
} = require('../constants');
const {
  mapHotel,
  mapQueryFields,
} = require('../services/property-mapping');
const { paginate } = require('../services/pagination');

// Helpers

const VALID_FIELDS = _.union(HOTEL_FIELDS, DESCRIPTION_FIELDS);

const fieldsOf = async (fields, contents) => {
  return fields.reduce(async (plainContent, field) => {
    plainContent = await plainContent;
    plainContent[field] = await contents[field];
    return plainContent;
  }, {});
};

const fetchHotel = async (hotel, fields) => {
  let indexProperties;
  let descriptionProperties;
  let errorFields;
  try {
    const indexFields = _.intersection(fields, HOTEL_FIELDS);
    if (indexFields.length) {
      indexProperties = fieldsOf(indexFields, hotel);
    }
    const descriptionFields = _.intersection(fields, DESCRIPTION_FIELDS);
    if (descriptionFields.length) {
      const indexRow = (await hotel.dataIndex).contents;
      const description = (await indexRow.descriptionUri).contents;
      descriptionProperties = fieldsOf(descriptionFields, description);
    }
  } catch (e) {
    errorFields = {
      error: e.message,
    };
  }
  return { ...(await indexProperties), ...(await descriptionProperties), ...(await errorFields), id: hotel.address };
};

const calculateFields = async fieldsQuery => {
  const fieldsArray = fieldsQuery.split(',');
  const mappedFields = await mapQueryFields(fieldsArray);
  return _.intersection(
    VALID_FIELDS,
    _.union(OBLIGATORY_FIELDS, mappedFields)
  );
};

// Actual controllers

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
