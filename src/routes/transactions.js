const express = require('express');
const transactions = require('../controllers/transactions');
const transactionsRoute = '/transactions';

const transactionsRouter = express.Router();
transactionsRouter.get(transactionsRoute, transactions.getStatuses);

module.exports = {
  transactionsRouter,
};
