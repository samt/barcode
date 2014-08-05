var assert = require('assert');
var upc_a = require('../lib/upc-a');

describe('UPC-A', function () {
  describe('.properties', function () {
    it('should have exports', function () {
      assert.equal('function', typeof upc_a.createCode, 'createCode is missing');
    });
  });
});
