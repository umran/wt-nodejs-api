const express = require('express');
const unitTypesRouter = express.Router();
const config = require('../../../../config.js');
const { loadAccount } = require('../../../helpers/crypto');
const { validatePassword,
  validateUnitType,
  validateAddImage,
  validateUnitTypeInformation,
  validateAmenity,
  validateCode,
  validatePrice } = require('../../../helpers/validators');

const { handle } = require('../../../../errors');
const { HotelManager } = require('@windingtree/wt-js-libs');

unitTypesRouter.get('/hotels/:hotelAddress/unitTypes', async (req, res, next) => {
  const { hotelAddress } = req.params;
  try {
    const hotelManager = new HotelManager({
      indexAddress: config.get('indexAddress'),
      gasMargin: config.get('gasMargin'),
      web3provider: config.get('web3'),
    });
    const hotel = await hotelManager.getHotel(hotelAddress);
    res.status(200).json({
      unitTypes: hotel.unitTypes,
    });
  } catch (err) {
    next(handle('web3', err));
  }
});

unitTypesRouter.post('/hotels/:hotelAddress/unitTypes', validateUnitType, validatePassword, async (req, res, next) => {
  const { password, unitType } = req.body;
  const { hotelAddress } = req.params;
  let ownerAccount = {};
  try {
    ownerAccount = config.get('web3').web3.eth.accounts.decrypt(loadAccount(config.get('privateKeyDir')), password);
    const hotelManager = new HotelManager({
      indexAddress: config.get('indexAddress'),
      owner: ownerAccount.address,
      gasMargin: config.get('gasMargin'),
      web3provider: config.get('web3'),
    });
    hotelManager.web3provider.web3.eth.accounts.wallet.add(ownerAccount);
    const { logs } = await hotelManager.addUnitType(hotelAddress, unitType);
    hotelManager.web3provider.web3.eth.accounts.wallet.remove(ownerAccount);
    res.status(200).json({
      txHash: logs[0].transactionHash,
    });
  } catch (err) {
    next(handle('web3', err));
  }
});

unitTypesRouter.delete('/hotels/:hotelAddress/unitTypes/:unitType', validatePassword, async (req, res, next) => {
  const { password } = req.body;
  const { hotelAddress, unitType } = req.params;
  let ownerAccount = {};
  try {
    ownerAccount = config.get('web3').web3.eth.accounts.decrypt(loadAccount(config.get('privateKeyDir')), password);
    const hotelManager = new HotelManager({
      indexAddress: config.get('indexAddress'),
      owner: ownerAccount.address,
      gasMargin: config.get('gasMargin'),
      web3provider: config.get('web3'),
    });
    hotelManager.web3provider.web3.eth.accounts.wallet.add(ownerAccount);
    const { logs } = await hotelManager.removeUnitType(hotelAddress, unitType);
    hotelManager.web3provider.web3.eth.accounts.wallet.remove(ownerAccount);
    res.status(200).json({
      txHash: logs[0].transactionHash,
    });
  } catch (err) {
    next(handle('web3', err));
  }
});

unitTypesRouter.put('/hotels/:hotelAddress/unitTypes/:unitType', validateUnitTypeInformation, validatePassword, async (req, res, next) => {
  const { password, description, minGuests, maxGuests } = req.body;
  const { hotelAddress, unitType } = req.params;
  let ownerAccount = {};
  try {
    ownerAccount = config.get('web3').web3.eth.accounts.decrypt(loadAccount(config.get('privateKeyDir')), password);
    const hotelManager = new HotelManager({
      indexAddress: config.get('indexAddress'),
      owner: ownerAccount.address,
      gasMargin: config.get('gasMargin'),
      web3provider: config.get('web3'),
    });
    hotelManager.web3provider.web3.eth.accounts.wallet.add(ownerAccount);
    const { logs } = await hotelManager.editUnitType(hotelAddress, unitType, description, minGuests, maxGuests);
    hotelManager.web3provider.web3.eth.accounts.wallet.remove(ownerAccount);
    res.status(200).json({
      txHash: logs[0].transactionHash,
    });
  } catch (err) {
    next(handle('web3', err));
  }
});

unitTypesRouter.post('/hotels/:hotelAddress/unitTypes/:unitType/images', validatePassword, validateAddImage, async (req, res, next) => {
  const { password, url } = req.body;
  const { hotelAddress, unitType } = req.params;
  let ownerAccount = {};
  try {
    ownerAccount = config.get('web3').web3.eth.accounts.decrypt(loadAccount(config.get('privateKeyDir')), password);
    const hotelManager = new HotelManager({
      indexAddress: config.get('indexAddress'),
      owner: ownerAccount.address,
      gasMargin: config.get('gasMargin'),
      web3provider: config.get('web3'),
    });
    hotelManager.web3provider.web3.eth.accounts.wallet.add(ownerAccount);
    const { logs } = await hotelManager.addImageUnitType(hotelAddress, unitType, url);
    hotelManager.web3provider.web3.eth.accounts.wallet.remove(ownerAccount);
    res.status(200).json({
      txHash: logs[0].transactionHash,
    });
  } catch (err) {
    return next(handle('web3', err));
  }
});

unitTypesRouter.delete('/hotels/:hotelAddress/unitTypes/:unitType/images/:id', validatePassword, async (req, res, next) => {
  const { hotelAddress, id, unitType } = req.params;
  const { password } = req.body;
  let ownerAccount = {};
  try {
    ownerAccount = config.get('web3').web3.eth.accounts.decrypt(loadAccount(config.get('privateKeyDir')), password);
    const hotelManager = new HotelManager({
      indexAddress: config.get('indexAddress'),
      owner: ownerAccount.address,
      gasMargin: config.get('gasMargin'),
      web3provider: config.get('web3'),
    });
    hotelManager.web3provider.web3.eth.accounts.wallet.add(ownerAccount);
    const { logs } = await hotelManager.removeImageUnitType(hotelAddress, unitType, id);
    hotelManager.web3provider.web3.eth.accounts.wallet.remove(ownerAccount);
    res.status(204).json({
      txHash: logs[0].transactionHash,
    });
  } catch (err) {
    return next(handle('web3', err));
  }
});

unitTypesRouter.post('/hotels/:hotelAddress/unitTypes/:unitType/amenities', validateAmenity, validatePassword, async (req, res, next) => {
  const { password, amenity } = req.body;
  const { hotelAddress, unitType } = req.params;
  let ownerAccount = {};
  try {
    ownerAccount = config.get('web3').web3.eth.accounts.decrypt(loadAccount(config.get('privateKeyDir')), password);
    const hotelManager = new HotelManager({
      indexAddress: config.get('indexAddress'),
      gasMargin: config.get('gasMargin'),
      owner: ownerAccount.address,
      web3provider: config.get('web3'),
    });
    hotelManager.web3provider.web3.eth.accounts.wallet.add(ownerAccount);
    const { logs } = await hotelManager.addAmenity(hotelAddress, unitType, amenity);
    hotelManager.web3provider.web3.eth.accounts.wallet.remove(ownerAccount);
    res.status(200).json({
      txHash: logs[0].transactionHash,
    });
  } catch (err) {
    next(handle('web3', err));
  }
});

unitTypesRouter.delete('/hotels/:hotelAddress/unitTypes/:unitType/amenities/:amenity', validatePassword, async (req, res, next) => {
  const { password } = req.body;
  const { hotelAddress, unitType, amenity } = req.params;
  let ownerAccount = {};
  try {
    ownerAccount = config.get('web3').web3.eth.accounts.decrypt(loadAccount(config.get('privateKeyDir')), password);
    const hotelManager = new HotelManager({
      indexAddress: config.get('indexAddress'),
      owner: ownerAccount.address,
      gasMargin: config.get('gasMargin'),
      web3provider: config.get('web3'),
    });
    hotelManager.web3provider.web3.eth.accounts.wallet.add(ownerAccount);
    const { logs } = await hotelManager.removeAmenity(hotelAddress, unitType, amenity);
    hotelManager.web3provider.web3.eth.accounts.wallet.remove(ownerAccount);
    res.status(200).json({
      txHash: logs[0].transactionHash,
    });
  } catch (err) {
    next(handle('web3', err));
  }
});

unitTypesRouter.post('/hotels/:hotelAddress/unitTypes/:unitType/currencyCode',
  validatePassword, validateCode,
  async (req, res, next) => {
    const { password, code } = req.body;
    const { hotelAddress, unitType } = req.params;
    let ownerAccount = {};
    try {
      let context = {
        indexAddress: config.get('indexAddress'),
        gasMargin: config.get('gasMargin'),
        web3provider: config.get('web3'),
      };
      ownerAccount = config.get('web3').web3.eth.accounts.decrypt(loadAccount(config.get('privateKeyDir')), password);
      context.owner = ownerAccount.address;
      const hotelManager = new HotelManager(context);
      hotelManager.web3provider.web3.eth.accounts.wallet.add(ownerAccount);
      const { logs } = await hotelManager.setCurrencyCode(hotelAddress, unitType, code);
      hotelManager.web3provider.web3.eth.accounts.wallet.remove(ownerAccount);
      res.status(200).json({
        txHash: logs[0].transactionHash,
      });
    } catch (err) {
      next(handle('web3', err));
    }
  });

unitTypesRouter.post('/hotels/:hotelAddress/unitTypes/:unitType/defaultPrice',
  validatePassword, validatePrice,
  async (req, res, next) => {
    const { password, price } = req.body;
    const { hotelAddress, unitType } = req.params;
    let ownerAccount = {};
    try {
      let context = {
        indexAddress: config.get('indexAddress'),
        gasMargin: config.get('gasMargin'),
        web3provider: config.get('web3'),
      };
      ownerAccount = config.get('web3').web3.eth.accounts.decrypt(loadAccount(config.get('privateKeyDir')), password);
      context.owner = ownerAccount.address;
      const hotelManager = new HotelManager(context);
      hotelManager.web3provider.web3.eth.accounts.wallet.add(ownerAccount);
      const { logs } = await hotelManager.setDefaultPrice(hotelAddress, unitType, price);
      hotelManager.web3provider.web3.eth.accounts.wallet.remove(ownerAccount);
      res.status(200).json({
        txHash: logs[0].transactionHash,
      });
    } catch (err) {
      next(handle('web3', err));
    }
  });

unitTypesRouter.post('/hotels/:hotelAddress/unitTypes/:unitType/defaultLifPrice',
  validatePassword, validatePrice,
  async (req, res, next) => {
    const { password, price } = req.body;
    const { hotelAddress, unitType } = req.params;
    let ownerAccount = {};
    try {
      let context = {
        indexAddress: config.get('indexAddress'),
        gasMargin: config.get('gasMargin'),
        web3provider: config.get('web3'),
      };
      ownerAccount = config.get('web3').web3.eth.accounts.decrypt(loadAccount(config.get('privateKeyDir')), password);
      context.owner = ownerAccount.address;
      const hotelManager = new HotelManager(context);
      hotelManager.web3provider.web3.eth.accounts.wallet.add(ownerAccount);
      const { logs } = await hotelManager.setDefaultLifPrice(hotelAddress, unitType, price);
      hotelManager.web3provider.web3.eth.accounts.wallet.remove(ownerAccount);
      res.status(200).json({
        txHash: logs[0].transactionHash,
      });
    } catch (err) {
      next(handle('web3', err));
    }
  });

module.exports = {
  unitTypesRouter,
};
