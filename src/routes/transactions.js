const express = require('express');
const transactions = require('../controllers/transactions');

const TRANSACTIONS_ROUTE = '/transactions';
const transactionsRouter = express.Router();

transactionsRouter.get(TRANSACTIONS_ROUTE, transactions.getStatuses);

module.exports = {
  transactionsRouter,
};
