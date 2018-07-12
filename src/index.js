const { app } = require('./app');
const { port, networkSetup } = require('./config');

const server = app.listen(port, () => {
  if (networkSetup) {
    networkSetup();
  }
});

module.exports = server;
