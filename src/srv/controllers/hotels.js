const { HotelManager } = require('@windingtree/wt-js-libs');
const { loadAccount } = require('../../helpers/crypto');
const { handle } = require('../../errors');

const config = require('../../config');
const { PASSWORD_HEADER } = require('../../helpers/validators');

const create = async (req, res, next) => {
  const { name, description } = req.body;
  const password = req.header(PASSWORD_HEADER);
  let ownerAccount = {};
  try {
    ownerAccount = config.get('web3provider').web3.eth.accounts.decrypt(loadAccount(config.get('privateKeyDir')), password);
    const hotelManager = new HotelManager({
      indexAddress: config.get('indexAddress'),
      owner: ownerAccount.address,
      gasMargin: config.get('gasMargin'),
      web3provider: config.get('web3provider'),
    });
    config.get('web3provider').web3.eth.accounts.wallet.add(ownerAccount);
    const { logs } = await hotelManager.createHotel(name, description);
    config.get('web3provider').web3.eth.accounts.wallet.remove(ownerAccount);
    res.status(200).json({
      txHash: logs[0].transactionHash,
    });
  } catch (err) {
    return next(handle('web3', err));
  }
};

const findAll = async (req, res, next) => {
  const password = req.header(PASSWORD_HEADER);
  let ownerAccount = {};
  try {
    ownerAccount = config.get('web3provider').web3.eth.accounts.decrypt(loadAccount(config.get('privateKeyDir')), password);
  } catch (err) {
    return next(handle('web3', err));
  }
  try {
    const hotelManager = new HotelManager({
      indexAddress: config.get('indexAddress'),
      owner: ownerAccount.address,
      gasMargin: config.get('gasMargin'),
      web3provider: config.get('web3provider'),
    });
    const hotels = await hotelManager.getHotels();
    res.status(200).json(hotels);
  } catch (err) {
    return next(handle('hotelManager', err));
  }
};

const find = async (req, res, next) => {
  const { hotelAddress } = req.params;
  try {
    const hotelManager = new HotelManager({
      indexAddress: config.get('indexAddress'),
      gasMargin: config.get('gasMargin'),
      web3provider: config.get('web3provider'),
    });
    const hotel = await hotelManager.getHotel(hotelAddress);
    res.status(200).json({
      hotel,
    });
  } catch (err) {
    next(handle('web3', err));
  }
};

const update = async (req, res, next) => {
  const { name, description } = req.body;
  const password = req.header(PASSWORD_HEADER);
  const { hotelAddress } = req.params;
  let ownerAccount = {};
  try {
    ownerAccount = config.get('web3provider').web3.eth.accounts.decrypt(loadAccount(config.get('privateKeyDir')), password);
    const hotelManager = new HotelManager({
      indexAddress: config.get('indexAddress'),
      owner: ownerAccount.address,
      gasMargin: config.get('gasMargin'),
      web3provider: config.get('web3provider'),
    });
    config.get('web3provider').web3.eth.accounts.wallet.add(ownerAccount);
    const { logs } = await hotelManager.changeHotelInfo(hotelAddress, name, description);
    config.get('web3provider').web3.eth.accounts.wallet.remove(ownerAccount);
    res.status(200).json({
      txHash: logs[0].transactionHash,
    });
  } catch (err) {
    return next(handle('web3', err));
  }
};

const remove = async (req, res, next) => {
  const password = req.header(PASSWORD_HEADER);
  const { hotelAddress } = req.params;
  let ownerAccount = {};
  try {
    ownerAccount = config.get('web3provider').web3.eth.accounts.decrypt(loadAccount(config.get('privateKeyDir')), password);
  } catch (err) {
    return next(handle('web3', err));
  }
  try {
    const hotelManager = new HotelManager({
      indexAddress: config.get('indexAddress'),
      owner: ownerAccount.address,
      gasMargin: config.get('gasMargin'),
      web3provider: config.get('web3provider'),
    });
    const { transactionHash } = await hotelManager.removeHotel(hotelAddress);
    res.status(204).json({
      txHash: transactionHash,
    });
  } catch (err) {
    return next(handle('hotelManager', err));
  }
};

module.exports = {
  create,
  find,
  findAll,
  remove,
  update,
};
