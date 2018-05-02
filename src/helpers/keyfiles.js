const fs = require('fs');

function loadKeyfile (file) {
  let privateKeyString = fs.readFileSync(file, 'utf8');
  return JSON.parse(privateKeyString);
}

module.exports = {
  loadKeyfile,
};
