/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const path = require('path');

const { expect } = require('chai');
const {
  loadKeyfile,
  storeKeyFile,
  removeKeyfile,
} = require('../../src/helpers/keyfiles');

const TEST_ACCOUNT_FILE = path.resolve('test/utils/test-keyfile.json');

describe('keyfiles.js', function () {
  it('should load keyfile', async () => {
    const privateKeyJSON = await loadKeyfile(TEST_ACCOUNT_FILE);
    expect(privateKeyJSON).to.be.ok;
  });
  it('should store keyfile', async () => {
    try {
      await storeKeyFile(await loadKeyfile(TEST_ACCOUNT_FILE), path.resolve('keys/test-keyfile.json'));
    } catch (e) {
      expect(false);
    }
  });
  it('should remove keyfile', async () => {
    try {
      await removeKeyfile(path.resolve('keys/test-keyfile.json'));
    } catch (e) {
      expect(false);
    }
  });
});
