const config = require('../config');

function getInstance () {
  return config.wtLibs;
}

module.exports = {
  getInstance,
};
