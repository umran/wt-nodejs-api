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
} = require('../../src/services/keyfiles');
const config = require('../../src/config');
const wallet = require('../utils/keys/ffa1e3be-e80a-4e1c-bb71-ed54c3bef115.json');

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const unlink = promisify(fs.unlink);

describe('keyfiles.js', () => {
  let originalKeyStorage;
  const tempPath = path.resolve('test/utils/temp-keys');

  before(() => {
    originalKeyStorage = config.get('keyFileStorage');
    config.set('keyFileStorage', tempPath);
  });

  beforeEach(async () => {
    await writeFile(path.resolve(config.get('keyFileStorage'), `${wallet.id}.json`), JSON.stringify(wallet), { encoding: 'utf8', flag: 'w' });
  });

  afterEach(async () => {
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
    expect(privateKeyJSON).to.have.property('id', wallet.id);
  });

  it('should throw when loading a non-existent keyfile', async () => {
    try {
      await loadKeyFile('random-nonexistent-uuid');
    } catch (e) {
      expect(e.message).to.match(/wallet not found/i);
    }
  });

  it('should store keyfile', async () => {
    await storeKeyFile(wallet);
    const fileContents = (await readFile(path.resolve(tempPath, `${wallet.id}.json`))).toString();
    expect(fileContents).to.eql(JSON.stringify(wallet));
  });

  it('should throw when keyfile cannot be stored', async () => {
    try {
      config.set('keyFileStorage', 'some-totally-nonexistent-path');
      await storeKeyFile(wallet);
    } catch (e) {
      expect(e.message).to.match(/wallet cannot be stored/i);
      config.set('keyFileStorage', tempPath);
    }
  });

  it('should remove keyfile', async () => {
    expect(fs.existsSync(path.resolve(tempPath, `${wallet.id}.json`))).to.be.true;
    await removeKeyFile(wallet.id);
    expect(fs.existsSync(path.resolve(tempPath, `${wallet.id}.json`))).to.be.false;
  });

  it('should throw when keyfile cannot be removed', async () => {
    try {
      await removeKeyFile('some-totally-random-nonexistent-uuid');
    } catch (e) {
      expect(e.message).to.match(/wallet cannot be removed/i);
    }
  });
});
