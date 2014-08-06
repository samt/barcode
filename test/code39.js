var assert = require('assert');
var code39 = require('../lib/code39');

describe('code39', function () {
  describe('.properties', function () {
    it('should have exports', function () {
      assert.equal('function', typeof code39.createCode, 'createCode is missing');
    });
  });
});
