const express = require('express');
const pricesRouter = express.Router();
const { loadAccount } = require('../../../helpers/crypto');
const { validatePassword,
  validatePrice,
  validateCode,
  validateCost,
  validateDateRange } = require('../../../helpers/validators');

const { handle } = require('../../../../errors');
const { HotelManager } = require('@windingtree/wt-js-libs');
const { User } = require('@windingtree/wt-js-libs');
const { BookingData } = require('@windingtree/wt-js-libs');

const config = require('../../../../config.js');

pricesRouter.post([
  '/hotels/:hotelAddress/unitTypes/:unitType/units/:unitAddress/defaultPrice',
  '/hotels/:hotelAddress/units/:unitAddress/defaultPrice',
], validatePassword, validatePrice,
async (req, res, next) => {
  const { password, price } = req.body;
  const { hotelAddress, unitAddress } = req.params;
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
    await hotelManager.setDefaultPrice(hotelAddress, unitAddress, price);
    hotelManager.web3provider.web3.eth.accounts.wallet.remove(ownerAccount);
    res.status(200).json({
      txHash: true, // logs[0].transactionHash
    });
  } catch (err) {
    next(handle('web3', err));
  }
});

pricesRouter.post([
  '/hotels/:hotelAddress/unitTypes/:unitType/units/:unitAddress/defaultLifPrice',
  '/hotels/:hotelAddress/units/:unitAddress/defaultLifPrice',
], validatePassword, validatePrice,
async (req, res, next) => {
  const { password, price } = req.body;
  const { hotelAddress, unitAddress } = req.params;
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
    const { logs } = await hotelManager.setDefaultLifPrice(hotelAddress, unitAddress, price);
    hotelManager.web3provider.web3.eth.accounts.wallet.remove(ownerAccount);
    res.status(200).json({
      txHash: logs[0].transactionHash,
    });
  } catch (err) {
    next(handle('web3', err));
  }
});

pricesRouter.post([
  '/hotels/:hotelAddress/unitTypes/:unitType/units/:unitAddress/currencyCode',
  '/hotels/:hotelAddress/units/:unitAddress/currencyCode',
], validatePassword, validateCode,
async (req, res, next) => {
  const { password, code } = req.body;
  const { hotelAddress, unitAddress } = req.params;
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
    await hotelManager.setCurrencyCode(hotelAddress, unitAddress, code);
    hotelManager.web3provider.web3.eth.accounts.wallet.remove(ownerAccount);
    res.status(200).json({
      txHash: true, // logs[0].transactionHash
    });
  } catch (err) {
    next(handle('web3', err));
  }
});
pricesRouter.post([
  '/hotels/:hotelAddress/unitTypes/:unitType/units/:unitAddress/specialLifPrice',
  '/hotels/:hotelAddress/units/:unitAddress/specialLifPrice',
], validatePassword, validatePrice,
async (req, res, next) => {
  const { password, price, from, days } = req.body;
  const { hotelAddress, unitAddress } = req.params;
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
    const { transactionHash } = await hotelManager.setUnitSpecialLifPrice(hotelAddress, unitAddress, price, from, days);
    hotelManager.web3provider.web3.eth.accounts.wallet.remove(ownerAccount);
    res.status(200).json({
      txHash: transactionHash,
    });
  } catch (err) {
    next(handle('web3', err));
  }
});

pricesRouter.post([
  '/hotels/:hotelAddress/unitTypes/:unitType/units/:unitAddress/specialPrice',
  '/hotels/:hotelAddress/units/:unitAddress/specialPrice',
], validatePassword, validatePrice,
async (req, res, next) => {
  const { password, price, from, days } = req.body;
  const { hotelAddress, unitAddress } = req.params;
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
    const { transactionHash } = await hotelManager.setUnitSpecialPrice(hotelAddress, unitAddress, price, from, days);
    hotelManager.web3provider.web3.eth.accounts.wallet.remove(ownerAccount);
    res.status(200).json({
      txHash: transactionHash,
    });
  } catch (err) {
    next(handle('web3', err));
  }
});

pricesRouter.get('/units/:unitAddress/cost', validateDateRange, async (req, res, next) => {
  const { from, days } = req.body;
  const { unitAddress } = req.params;
  try {
    const data = new BookingData(config.get('web3'));
    const cost = await data.getCost(unitAddress, from, days);
    res.status(200).json({ cost });
  } catch (err) {
    next(handle('web3', err));
  }
});

pricesRouter.get('/units/:unitAddress/lifCost', validateDateRange, async (req, res, next) => {
  const { from, days } = req.body;
  const { unitAddress } = req.params;
  try {
    const data = new BookingData(config.get('web3'));
    const cost = await data.getLifCost(unitAddress, from, days);
    res.status(200).json({ cost });
  } catch (err) {
    next(handle('web3', err));
  }
});

pricesRouter.get('/balance', validateCost, async (req, res, next) => {
  const { cost, account } = req.body;
  try {
    const user = new User({
      account,
      gasMargin: config.get('gasMargin'),
      tokenAddress: config.get('tokenAddress'),
      web3provider: config.get('web3'),
    });
    const balance = await user.balanceCheck(cost);
    res.status(200).json({ balance });
  } catch (err) {
    next(handle('web3', err));
  }
});

module.exports = {
  pricesRouter,
};
