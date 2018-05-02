const wtJsLibs = require('../services/wt-js-libs');

const TX_IDS_SEPARATOR = ',';

const getStatuses = async (req, res, next) => {
  let txIds = [];
  if (req.query.transactionIds) {
    txIds = req.query.transactionIds.split(TX_IDS_SEPARATOR);
  }
  res.status(200).json(await wtJsLibs.getInstance().getTransactionsStatus(txIds));
};

module.exports = {
  getStatuses,
};
