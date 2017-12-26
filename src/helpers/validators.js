const {handle} = require('../../errors')
function validatePasswords (req, res, next) {
  const { password, newPassword } = req.body
  if (!password) return next(handle('missingPassword', new Error()))
  if (!newPassword) return next(handle('missingNewPassword', new Error()))

  next()
}

function validatePassword (req, res, next) {
  const { password } = req.body
  if (!password) return next(handle('missingPassword', new Error()))
  next()
}

function validateCreateHotel (req, res, next) {
  const { password, name, description } = req.body
  if (!password) return next(handle('missingPassword', new Error()))
  if (!name) return next(handle('missingName', new Error()))
  if (!description) return next(handle('missingDescription', new Error()))
  next()
}

function validateAddImage (req, res, next) {
  const { url } = req.body
  if (!url) return next(handle('missingUrl', new Error()))
  next()
}

function validateType (req, res, next) {
  const { type } = req.body
  if (!type) return next(handle('missingType', new Error()))
  next()
}

function validateAmenity (req, res, next) {
  const { amenity } = req.body
  if (!amenity) return next(handle('missingAmenity', new Error()))
  next()
}

module.exports = {
  validateAddImage,
  validateAmenity,
  validateCreateHotel,
  validatePassword,
  validatePasswords,
  validateType
}
