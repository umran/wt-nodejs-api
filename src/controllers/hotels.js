const wtJsLibs = require('../services/wt-js-libs');
const { handle } = require('../errors');
const config = require('../config');

const create = async ({ body, wtWallet }, res, next) => {
  const { name, description, manager, location } = body;
  const wtLibsInstance = await wtJsLibs.getInstance();
  const index = await wtLibsInstance.getWTIndex(config.get('indexAddress'));
  try {
    const result = await index.addHotel(wtWallet, { name, description, manager, location });
    res.status(202).json(result);
  } catch (e) {
    next(handle('unknownError', e));
  }
};

const findAll = async (req, res, next) => {
  try {
    const wtLibsInstance = wtJsLibs.getInstance();
    const index = await wtLibsInstance.getWTIndex(config.get('indexAddress'));
    let hotels = await index.getAllHotels();
    let rawHotels = [];
    for (let hotel in hotels) {
      try {
        rawHotels.push({
          address: await hotel.address,
          name: await hotel.name,
          description: await hotel.description,
          manager: await hotel.manager,
          location: await hotel.location,
        });
      } catch (e) { console.log(e); }
    }
    res.status(200).json({ hotels: rawHotels });
  } catch (e) {
    next(handle('unknownError', e));
  }
};

const find = async ({ params, wtWallet }, res, next) => {
  const { hotelAddress } = params;
  const wtLibsInstance = await wtJsLibs.getInstance();
  const index = await wtLibsInstance.getWTIndex(config.get('indexAddress'));
  try {
    let hotel = await index.getHotel(hotelAddress);
    return res.status(200).json({ hotel: {
      address: await hotel.address,
      name: await hotel.name,
      description: await hotel.description,
      manager: await hotel.manager,
      location: await hotel.location,
    } });
  } catch (e) {
    next(handle('unknownError', e));
  }
};

const update = async ({ body, params, wtWallet }, res, next) => {
  const { url, name, description } = body;
  const { hotelAddress } = params;
  const wtLibsInstance = await wtJsLibs.getInstance();
  try {
    const index = await wtLibsInstance.getWTIndex(config.get('indexAddress'));
    const hotel = await index.getHotel(hotelAddress);
    hotel.url = url;
    hotel.name = name;
    hotel.description = description;

    const transactionIds = await index.updateHotel(wtWallet, hotel);
    res.status(202).json({ transactionIds });
  } catch (e) {
    next(handle('unknownError', e));
  }
};

const remove = async ({ wtWallet, params }, res, next) => {
  const { hotelAddress } = params;
  const wtLibsInstance = await wtJsLibs.getInstance();
  const index = await wtLibsInstance.getWTIndex(config.get('indexAddress'));
  const hotel = await index.getHotel(hotelAddress);
  try {
    const transactionIds = await index.removeHotel(wtWallet, hotel);
    res.status(202).json({ transactionIds });
  } catch (e) {
    next(handle('unknownError', e));
  }
};

module.exports = {
  create,
  find,
  findAll,
  remove,
  update,
};
