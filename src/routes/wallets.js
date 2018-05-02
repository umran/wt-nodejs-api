const express = require('express');
const {
  injectWtLibs,
} = require('../middlewares');
const walletsController = require('../controllers/wallets');

const WALLETS_ROUTE = '/wallets';
const WALLET_ROUTE = '/wallets/:walletId';
const walletsRouter = express.Router();

// We want more fine-grained control over error states, so we don't use unlockAccount here

// TODO introduce throttling for vulnerable wallet endpoints

// Data modifying methods
walletsRouter.post(WALLETS_ROUTE, injectWtLibs, walletsController.create);
walletsRouter.delete(WALLET_ROUTE, injectWtLibs, walletsController.remove);

// Read only methods
walletsRouter.get(WALLET_ROUTE, injectWtLibs, walletsController.get);

module.exports = {
  walletsRouter,
};
