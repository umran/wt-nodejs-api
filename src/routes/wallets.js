const express = require('express');
const {
  injectWtLibs,
  unlockAccount,
} = require('../middlewares');
const walletsController = require('../controllers/wallets');

const WALLETS_ROUTE = '/wallets';
const walletsRouter = express.Router();

// Data modifying methods
walletsRouter.post(WALLETS_ROUTE, injectWtLibs, walletsController.create);
walletsRouter.delete(WALLETS_ROUTE, unlockAccount, walletsController.remove);

module.exports = {
  walletsRouter,
};
