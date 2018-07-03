const { handleApplicationError } = require('../errors');

const hotelAddress = (req, res, next) => {
  const { hotelAddress } = req.params;
  const { wt } = res.locals;
  if (!wt.instance.dataModel.web3Instance.utils.checkAddressChecksum(hotelAddress)) {
    return next(handleApplicationError('hotelChecksum'));
  }

  next();
};

module.exports = {
  hotelAddress,
};
