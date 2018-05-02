/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');

const { expect } = require('chai');
const {
  loadKeyFile,
  storeKeyFile,
  removeKeyFile,
} = require('../../src/helpers/keyfiles');
const config = require('../../src/config');

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const unlink = promisify(fs.unlink);

describe('keyfiles.js', function () {
  let originalKeyStorage;
  const tempPath = path.resolve('test/utils/temp-keys');
  const wallet = {
    'version': 3,
    'id': 'ffa1e3be-e80a-4e1c-bb71-ed54c3bef115',
    'address': 'd39ca7d186a37bb6bf48ae8abfeb4c687dc8f906',
    'crypto': {
      'ciphertext': 'fa5fbe1e0ed455c7836e6d52a869969dd8da9c2dffea0ee6a8b09983e2bbaa9f',
      'cipherparams': { 'iv': 'b0c8dfe4129bab0c6d2270824aa0c9a4' },
      'cipher': 'aes-128-ctr',
      'kdf': 'scrypt',
      'kdfparams': {
        'dklen': 32,
        'salt': '731b9633516362108803c44cc44ba183b947a534d023c6332678e52e25b4f9eb',
        'n': 8192,
        'r': 8,
        'p': 1,
      },
      'mac': '901cf4c2114f38f65d60e8643efbbdfc088b189db802b30e94443c8851d37aec',
    },
  };

  before(() => {
    originalKeyStorage = config.get('keyFileStorage');
    config.set('keyFileStorage', tempPath);
  });

  beforeEach(async function () {
    await writeFile(path.resolve(config.get('keyFileStorage'), `${wallet.id}.json`), JSON.stringify(wallet), { encoding: 'utf8', flag: 'w' });
  });

  afterEach(async function () {
    if (fs.existsSync(path.resolve(tempPath, `${wallet.id}.json`))) {
      await unlink(path.resolve(tempPath, `${wallet.id}.json`));
    }
  });

  after(() => {
    config.set('keyFileStorage', originalKeyStorage);
  });

  it('should load keyfile', async () => {
    const privateKeyJSON = await loadKeyFile(wallet.id);
    expect(privateKeyJSON).to.be.ok;
  });

  it('should store keyfile', async () => {
    await storeKeyFile(wallet);
    const fileContents = (await readFile(path.resolve(tempPath, `${wallet.id}.json`))).toString();
    expect(fileContents).to.eql(JSON.stringify(wallet));
  });

  it('should remove keyfile', async () => {
    expect(fs.existsSync(path.resolve(tempPath, `${wallet.id}.json`))).to.be.true;
    await removeKeyFile(wallet.id);
    expect(fs.existsSync(path.resolve(tempPath, `${wallet.id}.json`))).to.be.false;
  });
});
