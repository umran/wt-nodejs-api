const { app } = require('./app');
const config = require('./config');
const { deployIndex, transferFounds } = require('./local-network');

const server = app.listen(config.get('port'), () => {
  if (process.env.ETH_NETWORK === 'local') {
    deployIndex();
    transferFounds();
  }
  if (config.get('log')) {
    console.log(`WT API AT ${config.get('port')}!`);
  }
});

module.exports = server;
