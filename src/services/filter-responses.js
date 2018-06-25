const _ = require('lodash');
const {
  DEFAULT_FIELDS,
  HOTEL_FIELDS,
  DESCRIPTION_FIELDS,
} = require('../constants.js');

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
    const indexRow = (await hotel.dataIndex).contents;

    const indexFields = _.intersection(fields, HOTEL_FIELDS);
    if (indexFields.length) {
      indexProperties = fieldsOf(indexFields, hotel);
    }

    const description = (await indexRow.descriptionUri).contents;
    const descriptionFields = _.intersection(fields, DESCRIPTION_FIELDS);
    if (descriptionFields.length) {
      descriptionProperties = fieldsOf(fields, description);
    }
  } catch (e) {
    errorFields = {
      error: e.message,
    };
  }
  return { ...(await indexProperties), ...(await descriptionProperties), ...(await errorFields), id: hotel.address };
};

const calculateFields = fieldsQuery => {
  return _.intersection(
    VALID_FIELDS,
    _.union(DEFAULT_FIELDS, fieldsQuery.split(','))
  );
};

module.exports = {
  fetchHotel,
  calculateFields,
};
