const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const app = express();
const config = require('./config');
const { version } = require('../package.json');

const { validateWhiteList } = require('./helpers/validators');
const { hotelsRouter } = require('./routes/hotels/hotels');

app.use('/docs', swaggerUi.serve, swaggerUi.setup(require('../docs/swagger.json')));
app.use(bodyParser.json());
app.use('/*', validateWhiteList);
app.use(hotelsRouter);

app.use((err, req, res, next) => {
  res.status(400).json({
    code: err.code,
    short: err.short,
    long: err.long,
  });
  if (config.get('log')) {
    console.error(err);
  }
});

app.use('/', (req, res) => {
  const response = {
    docs: 'https://github.com/windingtree/wt-nodejs-api/blob/master/README.md',
    info: 'https://github.com/windingtree/wt-nodejs-api',
    version,
  };
  res.status(200).json(response);
});

module.exports = {
  app,
};
