const {handle} = require('../../errors')
function validatePasswords (req, res, next){
  const { password, newPassword } = req.body
  if (!password) return next(handle('missingPassword', new Error()));
  if (!newPassword) return next(handle('missingNewPassword', new Error()));

  next()
}

module.exports = {
  validatePasswords
}
