const express = require('express');
const pricesRouter = express.Router();
const { loadAccount } = require('../../../helpers/crypto');
const { validatePassword,
  validatePrice,
  validateCost,
  validateDateRange } = require('../../../helpers/validators');

const { handle } = require('../../../errors');
const { HotelManager, User, BookingData } = require('@windingtree/wt-js-libs');

const config = require('../../../config.js');

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
      web3provider: config.get('web3provider'),
    };
    ownerAccount = config.get('web3provider').web3.eth.accounts.decrypt(loadAccount(config.get('privateKeyDir')), password);
    context.owner = ownerAccount.address;
    const hotelManager = new HotelManager(context);
    config.get('web3provider').web3.eth.accounts.wallet.add(ownerAccount);
    const fromDate = new Date(from);
    const { transactionHash } = await hotelManager.setUnitSpecialLifPrice(hotelAddress, unitAddress, price, fromDate, days);
    config.get('web3provider').web3.eth.accounts.wallet.remove(ownerAccount);
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
      web3provider: config.get('web3provider'),
    };
    ownerAccount = config.get('web3provider').web3.eth.accounts.decrypt(loadAccount(config.get('privateKeyDir')), password);
    context.owner = ownerAccount.address;
    const hotelManager = new HotelManager(context);
    config.get('web3provider').web3.eth.accounts.wallet.add(ownerAccount);
    const fromDate = new Date(from);
    const { transactionHash } = await hotelManager.setUnitSpecialPrice(hotelAddress, unitAddress, price, fromDate, days);
    config.get('web3provider').web3.eth.accounts.wallet.remove(ownerAccount);
    res.status(200).json({
      txHash: transactionHash,
    });
  } catch (err) {
    next(handle('web3', err));
  }
});

pricesRouter.get('/hotels/:hotelAddress/units/:unitAddress/cost', validateDateRange, async (req, res, next) => {
  const { from, days } = req.body;
  const { hotelAddress, unitAddress } = req.params;
  try {
    const data = new BookingData({ web3provider: config.get('web3provider') });
    const fromDate = new Date(from);
    const cost = await data.getCost(hotelAddress, unitAddress, fromDate, days);
    res.status(200).json({ cost });
  } catch (err) {
    next(handle('web3', err));
  }
});

pricesRouter.get('/hotels/:hotelAddress/units/:unitAddress/lifCost', validateDateRange, async (req, res, next) => {
  const { from, days } = req.body;
  const { hotelAddress, unitAddress } = req.params;
  try {
    const data = new BookingData({ web3provider: config.get('web3provider') });
    const cost = await data.getLifCost(hotelAddress, unitAddress, from, days);
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
      web3provider: config.get('web3provider'),
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
