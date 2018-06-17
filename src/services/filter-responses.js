const excludeFields = async (plainHotel, fields) => {
  return fields.reduce((newObject, fieldToRemove) => {
    delete newObject[fieldToRemove];
    return newObject;
  }, plainHotel);
};
const includeFields = async (hotel, fields) => {
  return fields.reduce(async (hotelWithNewField, fieldToAdd) => {
    hotelWithNewField = await hotelWithNewField;
    if (hotel[fieldToAdd]) {
      hotelWithNewField[fieldToAdd] = hotel[fieldToAdd];
    }
    return hotelWithNewField;
  }, Promise.resolve({ description: await hotel.description }));
};

const resolveObject = async obj => {
  const newObj = {};
  for (let key of Object.keys(obj)) {
    newObj[key] = await obj[key];
  }
  return newObj;
};

module.exports = {
  excludeFields,
  includeFields,
  resolveObject,
};
