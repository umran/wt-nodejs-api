const { handle } = require('../errors');
const config = require('../config.js');

function validateWhiteList (req, res, next) {
  const whiteList = config.get('whiteList');
  if (!whiteList.length) return next();
  let ip = req.ip ||
            req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

  if (ip.substr(0, 7) === '::ffff:') ip = ip.substr(7);
  if (whiteList.indexOf(ip) === -1) return next(handle('whiteList', new Error()));

  next();
}

function validatePasswords (req, res, next) {
  const { password, newPassword } = req.body;
  if (!password) return next(handle('missingPassword', new Error()));
  if (!newPassword) return next(handle('missingNewPassword', new Error()));

  next();
}

function validatePassword (req, res, next) {
  const { password } = req.body;
  if (!password) return next(handle('missingPassword', new Error()));
  next();
}

function validateHotelInfo (req, res, next) {
  const { password, name, description } = req.body;
  if (!password) return next(handle('missingPassword', new Error()));
  if (!name) return next(handle('missingName', new Error()));
  if (!description) return next(handle('missingDescription', new Error()));
  next();
}

function validateAddImage (req, res, next) {
  const { url } = req.body;
  if (!url) return next(handle('missingUrl', new Error()));
  next();
}

function validateUnitType (req, res, next) {
  const { unitType } = req.body;
  if (!unitType) return next(handle('missingUnitType', new Error()));
  next();
}

function validateAmenity (req, res, next) {
  const { amenity } = req.body;
  if (!amenity) return next(handle('missingAmenity', new Error()));
  next();
}

function validateActive (req, res, next) {
  const { active } = req.body;
  if (!active) return next(handle('missingActive', new Error()));
  next();
}

function validateWallet (req, res, next) {
  const { wallet } = req.body;
  if (!wallet) return next(handle('missingWallet', new Error()));
  next();
}

function validateHotelAddress (req, res, next) {
  const { lineOne, lineTwo, zipCode, country } = req.body;
  if (!lineOne) return next(handle('missingLineOne', new Error()));
  if (!lineTwo) return next(handle('missingLineTwo', new Error()));
  if (!zipCode) return next(handle('missingZipCode', new Error()));
  if (!country) return next(handle('missingCountry', new Error()));
  next();
}

function validateHotelLocation (req, res, next) {
  const { timezone, latitude, longitude } = req.body;
  if (!timezone && timezone !== 0) return next(handle('missingTimezone', new Error()));
  if (!latitude) return next(handle('missingLatitude', new Error()));
  if (!longitude) return next(handle('missingLongitude', new Error()));
  next();
}

function validatePrice (req, res, next) {
  const { price } = req.body;
  if (!price) return next(handle('missingPrice', new Error()));
  next();
}

function validateCode (req, res, next) {
  const { code } = req.body;
  if (!code) return next(handle('missingCode', new Error()));
  next();
}

function validateUnitTypeInformation (req, res, next) {
  const { description, minGuests, maxGuests } = req.body;
  if (!description) return next(handle('missingDescription', new Error()));
  if (!minGuests) return next(handle('missingMinGuests', new Error()));
  if (!maxGuests) return next(handle('missingMaxGuests', new Error()));
  next();
}

function validateReservationId (req, res, next) {
  const { reservationId } = req.body;
  if (!reservationId) return next(handle('missingReservationId', new Error()));
  next();
}

function validateRequired (req, res, next) {
  const { required } = req.body;
  if (!required && required !== false) return next(handle('missingRequired', new Error()));
  next();
}

function validateDate (req, res, next) {
  const { date } = req.body;
  if (!date) return next(handle('missingDate', new Error()));
  next();
}

function validateDateRange (req, res, next) {
  const { from, days } = req.body;
  if (!from) return next(handle('missingFrom', new Error()));
  if (!days) return next(handle('missingDays', new Error()));
  next();
}

function validateCost (req, res, next) {
  const { cost } = req.body;
  if (!cost) return next(handle('missingCost', new Error()));
  next();
}
module.exports = {
  validateActive,
  validateAddImage,
  validateAmenity,
  validateCode,
  validateCost,
  validateDate,
  validateDateRange,
  validateHotelInfo,
  validateHotelAddress,
  validateHotelLocation,
  validatePassword,
  validatePrice,
  validatePasswords,
  validateReservationId,
  validateRequired,
  validateUnitType,
  validateUnitTypeInformation,
  validateWallet,
  validateWhiteList,
};
