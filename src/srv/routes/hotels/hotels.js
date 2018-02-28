const express = require('express');
const hotelsRouter = express.Router();
const { loadAccount } = require('../../../helpers/crypto');
const { validatePassword,
  validateHotelInfo,
  validateHotelAddress,
  validateHotelLocation,
  validateAddImage,
} = require('../../../helpers/validators');
const { handle } = require('../../../../errors');
const HotelManager = require('../../../../wt-js-libs/dist/node/HotelManager.js');
const Utils = require('../../../../wt-js-libs/dist/node/Utils.js');

const config = require('../../../../config.js');

hotelsRouter.post('/hotels', validateHotelInfo, async (req, res, next) => {
  const { password, name, description } = req.body;
  let ownerAccount = {};
  try {
    ownerAccount = config.get('web3').eth.accounts.decrypt(loadAccount(config.get('privateKeyDir')), password);
    const hotelManager = new HotelManager({
      indexAddress: config.get('indexAddress'),
      owner: ownerAccount.address,
      gasMargin: config.get('gasMargin'),
      web3: config.get('web3'),
    });
    hotelManager.web3.eth.accounts.wallet.add(ownerAccount);
    const { logs } = await hotelManager.createHotel(name, description);
    hotelManager.web3.eth.accounts.wallet.remove(ownerAccount);
    res.status(200).json({
      txHash: logs[0].transactionHash,
    });
  } catch (err) {
    return next(handle('web3', err));
  }
});

hotelsRouter.get('/hotels', validatePassword, async (req, res, next) => {
  const { password } = req.body;
  let ownerAccount = {};
  try {
    ownerAccount = config.get('web3').eth.accounts.decrypt(loadAccount(config.get('privateKeyDir')), password);
  } catch (err) {
    return next(handle('web3', err));
  }
  try {
    const hotelManager = new HotelManager({
      indexAddress: config.get('indexAddress'),
      owner: ownerAccount.address,
      gasMargin: config.get('gasMargin'),
      web3: config.get('web3'),
    });
    const hotels = await hotelManager.getHotels();
    res.status(200).json(hotels);
  } catch (err) {
    return next(handle('hotelManager', err));
  }
});

hotelsRouter.get('/hotels/:address', async (req, res, next) => {
  const { address } = req.params;
  try {
    const hotelManager = new HotelManager({
      indexAddress: config.get('indexAddress'),
      gasMargin: config.get('gasMargin'),
      web3: config.get('web3'),
    });
    const hotel = await hotelManager.getHotel(address);
    res.status(200).json({
      hotel,
    });
  } catch (err) {
    next(handle('web3', err));
  }
});

hotelsRouter.delete('/hotels/:address', validatePassword, async (req, res, next) => {
  const { password } = req.body;
  const { address } = req.params;
  let ownerAccount = {};
  try {
    ownerAccount = config.get('web3').eth.accounts.decrypt(loadAccount(config.get('privateKeyDir')), password);
  } catch (err) {
    return next(handle('web3', err));
  }
  try {
    const hotelManager = new HotelManager({
      indexAddress: config.get('indexAddress'),
      owner: ownerAccount.address,
      gasMargin: config.get('gasMargin'),
      web3: config.get('web3'),
    });
    const { transactionHash } = await hotelManager.removeHotel(address);
    res.status(204).json({
      txHash: transactionHash,
    });
  } catch (err) {
    return next(handle('hotelManager', err));
  }
});

hotelsRouter.put('/hotels/:address', validateHotelInfo, async (req, res, next) => {
  const { password, name, description } = req.body;
  const { address } = req.params;
  let ownerAccount = {};
  try {
    ownerAccount = config.get('web3').eth.accounts.decrypt(loadAccount(config.get('privateKeyDir')), password);
    const hotelManager = new HotelManager({
      indexAddress: config.get('indexAddress'),
      owner: ownerAccount.address,
      gasMargin: config.get('gasMargin'),
      web3: config.get('web3'),
    });
    hotelManager.web3.eth.accounts.wallet.add(ownerAccount);
    const { logs } = await hotelManager.changeHotelInfo(address, name, description);
    hotelManager.web3.eth.accounts.wallet.remove(ownerAccount);
    res.status(200).json({
      txHash: logs[0].transactionHash,
    });
  } catch (err) {
    return next(handle('web3', err));
  }
});

hotelsRouter.put('/hotels/:address/address', validatePassword, validateHotelAddress, async (req, res, next) => {
  const { password, lineOne, lineTwo, zipCode, country } = req.body;
  const { address } = req.params;
  let ownerAccount = {};
  try {
    ownerAccount = config.get('web3').eth.accounts.decrypt(loadAccount(config.get('privateKeyDir')), password);
    const hotelManager = new HotelManager({
      indexAddress: config.get('indexAddress'),
      owner: ownerAccount.address,
      gasMargin: config.get('gasMargin'),
      web3: config.get('web3'),
    });
    hotelManager.web3.eth.accounts.wallet.add(ownerAccount);
    const { logs } = await hotelManager.changeHotelAddress(address, lineOne, lineTwo, zipCode, country);
    hotelManager.web3.eth.accounts.wallet.remove(ownerAccount);
    res.status(200).json({
      txHash: logs[0].transactionHash,
    });
  } catch (err) {
    return next(handle('web3', err));
  }
});

hotelsRouter.put('/hotels/:address/location', validatePassword, validateHotelLocation, async (req, res, next) => {
  const { password, timezone, latitude, longitude } = req.body;
  const { address } = req.params;
  let ownerAccount = {};
  try {
    ownerAccount = config.get('web3').eth.accounts.decrypt(loadAccount(config.get('privateKeyDir')), password);
    const hotelManager = new HotelManager({
      indexAddress: config.get('indexAddress'),
      owner: ownerAccount.address,
      gasMargin: config.get('gasMargin'),
      web3: config.get('web3'),
    });
    hotelManager.web3.eth.accounts.wallet.add(ownerAccount);
    const { logs } = await hotelManager.changeHotelLocation(address, timezone, latitude, longitude);
    hotelManager.web3.eth.accounts.wallet.remove(ownerAccount);
    res.status(200).json({
      txHash: logs[0].transactionHash,
    });
  } catch (err) {
    return next(handle('web3', err));
  }
});

hotelsRouter.post('/hotels/:address/images', validatePassword, validateAddImage, async (req, res, next) => {
  const { password, url } = req.body;
  const { address } = req.params;
  let ownerAccount = {};
  try {
    ownerAccount = config.get('web3').eth.accounts.decrypt(loadAccount(config.get('privateKeyDir')), password);
    const hotelManager = new HotelManager({
      indexAddress: config.get('indexAddress'),
      owner: ownerAccount.address,
      gasMargin: config.get('gasMargin'),
      web3: config.get('web3'),
    });
    hotelManager.web3.eth.accounts.wallet.add(ownerAccount);
    const { logs } = await hotelManager.addImageHotel(address, url);
    hotelManager.web3.eth.accounts.wallet.remove(ownerAccount);
    res.status(200).json({
      txHash: logs[0].transactionHash,
    });
  } catch (err) {
    return next(handle('web3', err));
  }
});

hotelsRouter.get('/hotels/:address/images', async (req, res, next) => {
  const { address } = req.params;
  try {
    const images = [];
    const context = {
      indexAddress: config.get('indexAddress'),
      gasMargin: config.get('gasMargin'),
      web3: config.get('web3'),
    };
    const hotelInstance = Utils.getInstance('Hotel', address, context);
    const totalImages = await hotelInstance.methods.getImagesLength().call();
    for (var i = 0; i < totalImages; i++) {
      images.push(await hotelInstance.methods.images(i).call());
    }
    res.status(200).json({
      images,
    });
  } catch (err) {
    return next(handle('web3', err));
  }
});

hotelsRouter.delete('/hotels/:address/images/:id', validatePassword, async (req, res, next) => {
  const { address, id } = req.params;
  const { password } = req.body;
  let ownerAccount = {};
  try {
    ownerAccount = config.get('web3').eth.accounts.decrypt(loadAccount(config.get('privateKeyDir')), password);
    const hotelManager = new HotelManager({
      indexAddress: config.get('indexAddress'),
      owner: ownerAccount.address,
      gasMargin: config.get('gasMargin'),
      web3: config.get('web3'),
    });
    hotelManager.web3.eth.accounts.wallet.add(ownerAccount);
    const hotel = await hotelManager.getHotel(address);
    const response = {
      txHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    };
    if (hotel.images.length > id) {
      const { logs } = await hotelManager.removeImageHotel(address, id);
      response.txHash = logs[0].transactionHash;
    }
    hotelManager.web3.eth.accounts.wallet.remove(ownerAccount);
    res.status(204).json(response);
  } catch (err) {
    return next(handle('web3', err));
  }
});

module.exports = {
  hotelsRouter,
};
