const errorCodes = require('./codes.js');

function handle (code, e) {
  if (code === 'web3') {
    // Generic web3 error
    e.status = 500;
    e.code = `#${code}`;
    e.short = e.name;
    e.long = e.message;
    return e;
  }
  const desc = errorCodes[code] || errorCodes.unknownError;
  e.status = desc.status;
  e.code = `#${code}`;
  e.short = desc.short;
  e.long = desc.long;
  return e;
}

module.exports = {
  handle,
};
