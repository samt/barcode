var assert = require('assert');
var codabar = require('../lib/codabar');

describe('codabar', function () {
  describe('.properties', function () {
    it('should have exports', function () {
      assert.equal('function', typeof codabar.createCode, 'createCode is missing');
    });
  });
});
