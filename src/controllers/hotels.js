const { handleApplicationError } = require('../errors');

const create = async (req, res, next) => {
  const { name, description, manager, location } = req.body;
  try {
    const result = await req.wt.index.addHotel(req.wt.wallet, { name, description, manager, location });
    res.status(202).json(result);
  } catch (e) {
    next(handleApplicationError('unknownError', e));
  }
};

const findAll = async (req, res, next) => {
  try {
    let hotels = await req.wt.index.getAllHotels();
    let rawHotels = [];
    for (let hotel of hotels) {
      try {
        rawHotels.push(await hotel.toPlainObject());
      } catch (e) { console.log(e); }
    }
    res.status(200).json({ hotels: rawHotels });
  } catch (e) {
    next(handleApplicationError('unknownError', e));
  }
};

const find = async (req, res, next) => {
  const { hotelAddress } = req.params;
  try {
    let hotel = await req.wt.index.getHotel(hotelAddress);
    return res.status(200).json(await hotel.toPlainObject());
  } catch (e) {
    next(handleApplicationError('unknownError', e));
  }
};

const update = async (req, res, next) => {
  const { url, name, description } = req.body;
  const { hotelAddress } = req.params;
  try {
    const hotel = await req.wt.index.getHotel(hotelAddress);
    hotel.url = url;
    hotel.name = name;
    hotel.description = description;

    const transactionIds = await req.wt.index.updateHotel(req.wt.wallet, hotel);
    res.status(202).json({ transactionIds });
  } catch (e) {
    next(handleApplicationError('unknownError', e));
  }
};

const remove = async (req, res, next) => {
  const { hotelAddress } = req.params;
  const hotel = await req.wt.index.getHotel(hotelAddress);
  try {
    const transactionIds = await req.wt.index.removeHotel(req.wt.wallet, hotel);
    res.status(202).json({ transactionIds });
  } catch (e) {
    next(handleApplicationError('unknownError', e));
  }
};

module.exports = {
  create,
  find,
  findAll,
  remove,
  update,
};
