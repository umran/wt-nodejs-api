const { app } = require('./app');
const config = require('./config');

const server = app.listen(config.get('port'), () => {
  console.debug(`WT API AT ${config.get('port')}!`);
});

module.exports = server;
