var assert = require('assert');
var code128 = require('../lib/code128');

describe('code128', function () {
  describe('.properties', function () {
    it('should have exports', function () {
      assert.equal('function', typeof code128.createCode, 'createCode is missing');
    });
  });
});
