const express = require('express');
const {
  injectWtLibs,
} = require('../middlewares');
const { createThrottlingInstance } = require('../middlewares/throttling.js');
const walletsController = require('../controllers/wallets');

const WALLETS_ROUTE = '/wallets';
const WALLET_ROUTE = '/wallets/:walletId';
const walletsRouter = express.Router();

// We want more fine-grained control over error states, so we don't use unlockAccount here

// Data modifying methods
walletsRouter.post(WALLETS_ROUTE, injectWtLibs, walletsController.create);
walletsRouter.delete(WALLET_ROUTE, createThrottlingInstance({
  windowMs: 60000, // 1 min
  delayAfter: 2, // Start delaying after first request
  delayMs: 2000, // Delay every subsequent request for 2 seconds
  max: 3, // Start blocking after 3 requests
}), injectWtLibs, walletsController.remove);

// Read only methods
walletsRouter.get(WALLET_ROUTE, createThrottlingInstance({
  windowMs: 60000, // 1 min
  delayAfter: 2, // Start delaying after first request
  delayMs: 2000, // Delay every subsequent request for 2 seconds
  max: 3, // Start blocking after 3 requests
}), injectWtLibs, walletsController.get);

module.exports = {
  walletsRouter,
};
