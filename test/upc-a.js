var assert = require('assert');
var upc_a = require('../lib/upc-a');

describe('UPC-A', function () {
  describe('.properties', function () {
    it('should have exports', function () {
      assert.equal('function', typeof upc_a.createCode, 'createCode is missing');
      assert.equal('function', typeof upc_a.getCheckDigit, 'getCheckDigit is missing');
    });
  });

  describe('.getCheckDigit()', function () {
    it('should calculate check digits correctly', function () {
      assert.equal(9, upc_a.getCheckDigit('04878943035'));
      assert.equal(0, upc_a.getCheckDigit('07017715424'));
      assert.equal(2, upc_a.getCheckDigit('05543762275'));
    });
  });
});
