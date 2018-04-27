/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const path = require('path');

const { expect } = require('chai');
const { loadKeyfile } = require('../../src/helpers/keyfiles');

const TEST_ACCOUNT_FILE = path.resolve('test/utils/test-keyfile.json');

describe('keyfiles.js', function () {
  it('should load keyfile', async function () {
    const privateKeyJSON = loadKeyfile(TEST_ACCOUNT_FILE);
    expect(privateKeyJSON).to.be.ok;
  });
});
