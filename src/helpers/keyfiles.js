const fs = require('fs');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

const loadKeyfile = async (path) => {
  return JSON.parse(await readFile(path, 'utf8'));
};

const storeKeyFile = async (wallet, path) => {
  await writeFile(path, JSON.stringify(wallet), { encoding: 'utf8', flag: 'w' });
};

const removeKeyfile = async (path) => {
  await unlink(path);
};

module.exports = {
  loadKeyfile,
  storeKeyFile,
  removeKeyfile,
};
