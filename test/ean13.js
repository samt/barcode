var assert = require('assert'),
  ean13 = require('../lib/ean13');

describe('EAN13', function () {
  describe('.properties', function () {
    it('should have exports', function () {
      assert.equal('function', typeof ean13.createCode, 'createCode is missing');
      assert.equal('function', typeof ean13.generateSequence, 'generateSequence is missing');
    });
  });

  describe('EAN13.generateSequence', function () {
    it('should generate a proper sequence', function () {
      assert.equal(ean13.generateSequence('113928472223','6').join(','),
        '1,1,1,2,2,2,1,1,4,1,1,2,1,1,3,2,1,2,2,3,1,2,' +
        '1,2,3,1,1,1,1,1,1,1,1,3,1,2,2,1,2,2,2,1,2,2,' +
        '2,1,2,2,1,4,1,1,1,1,1,4,1,1,1');
    });
  });
});
