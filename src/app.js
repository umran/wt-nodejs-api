const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const app = express();
const config = require('./config');
const { version } = require('../package.json');

const { validateIPWhiteList } = require('./middlewares');
const { hotelsRouter } = require('./routes/hotels');

const { handleApplicationError } = require('./errors');
const wtJsLibsService = require('./services/wt-js-libs');

wtJsLibsService.initialize(config.get('web3Provider'), config.get('swarmProviderUrl'));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(require('../docs/swagger.json')));
app.use(bodyParser.json());
app.use('/*', validateIPWhiteList);
app.use(hotelsRouter);

// Error handler
app.use((err, req, res, next) => {
  if (config.get('log')) {
    console.error(err);
  }
  if (!err.code) {
    // Handle special cases of generic errors
    if (err.message === 'Invalid JSON RPC response: ""') {
      err = handleApplicationError('unreachableChain', err);
    } else {
      err = handleApplicationError('genericError', err);
    }
  }
  res.status(err.status).json({
    status: err.status,
    code: err.code,
    short: err.short,
    long: err.long,
  });
});

// Root handler
app.get('/', (req, res) => {
  const response = {
    docs: 'https://github.com/windingtree/wt-nodejs-api/blob/master/README.md',
    info: 'https://github.com/windingtree/wt-nodejs-api',
    version,
  };
  res.status(200).json(response);
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 404,
    code: '#notFound',
    short: 'Page not found',
    long: 'This endpoint does not exist',
  });
});

module.exports = {
  app,
};
