const { handleApplicationError } = require('../errors');

const findAll = async (req, res, next) => {
  try {
    let hotels = await res.locals.wt.index.getAllHotels();
    let rawHotels = [];
    for (let hotel of hotels) {
      rawHotels.push(await hotel.toPlainObject());
    }
    res.status(200).json({ hotels: rawHotels });
  } catch (e) {
    next(e);
  }
};

const find = async (req, res, next) => {
  const { hotelAddress } = req.params;
  try {
    let hotel = await res.locals.wt.index.getHotel(hotelAddress);
    return res.status(200).json({ hotel: await hotel.toPlainObject() });
  } catch (e) {
    if (e.message.match(/cannot find hotel/i)) {
      return next(handleApplicationError('hotelNotFound', e));
    }
    next(e);
  }
};

const create = async (req, res, next) => {
  const { hotel: hotelData } = req.body;
  if (!hotelData.manager) {
    return next(handleApplicationError('missingManager'));
  }
  try {
    const result = await res.locals.wt.index.addHotel(res.locals.wt.wallet, hotelData);
    res.status(202).json(result);
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  const { hotel: hotelData } = req.body;
  const { hotelAddress } = req.params;
  try {
    const hotel = await res.locals.wt.index.getHotel(hotelAddress);
    if (hotelData.url) {
      hotel.url = hotelData.url;
    }
    if (hotelData.name) {
      hotel.name = hotelData.name;
    }
    if (hotelData.description) {
      hotel.description = hotelData.description;
    }

    const transactionIds = await res.locals.wt.index.updateHotel(res.locals.wt.wallet, hotel);
    res.status(202).json({ transactionIds });
  } catch (e) {
    if (e.message.match(/cannot find hotel/i)) {
      return next(handleApplicationError('hotelNotFound', e));
    }
    if (e.message.match(/transaction originator/i)) {
      return next(handleApplicationError('managerWalletMismatch', e));
    }
    next(e);
  }
};

const remove = async (req, res, next) => {
  const { hotelAddress } = req.params;
  try {
    const hotel = await res.locals.wt.index.getHotel(hotelAddress);
    const transactionIds = await res.locals.wt.index.removeHotel(res.locals.wt.wallet, hotel);
    res.status(202).json({ transactionIds });
  } catch (e) {
    if (e.message.match(/cannot find hotel/i)) {
      return next(handleApplicationError('hotelNotFound', e));
    }
    if (e.message.match(/transaction originator/i)) {
      return next(handleApplicationError('managerWalletMismatch', e));
    }
    next(e);
  }
};

module.exports = {
  create,
  find,
  findAll,
  remove,
  update,
};
