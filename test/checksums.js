var assert = require('assert');
var checksums = require('../lib/utils/checksums');

describe('util.checksums', function () {
  describe('.properties', function () {
    it('should have exports', function () {
      assert.equal('function', typeof checksums.weight3even10, 'weight3even10 is missing');
      assert.equal('function', typeof checksums.weight3odd10, 'weight3odd10 is missing');
    });
  });

  describe('.weight3even10()', function () {
    it('should calculate check digits correctly for EAN13 patterns', function () {
      assert.equal(7, checksums.weight3even10('590123412345')); // wikipedia's example
      assert.equal(2, checksums.weight3even10('977147396801'));
      assert.equal(8, checksums.weight3even10('123456789012'));
    });
  });

  describe('.weight3odd10()', function () {
    it('should calculate check digits correctly for EAN8 patterns', function () {
      assert.equal(0, checksums.weight3odd10('1234567'));
      assert.equal(6, checksums.weight3odd10('5048706'));
      assert.equal(9, checksums.weight3odd10('5449010'));
      assert.equal(4, checksums.weight3odd10('6583325'));
    });

    it('should calculate check digits correctly for UPC-(A|E) patterns', function () {
      assert.equal(9, checksums.weight3odd10('04878943035'));
      assert.equal(0, checksums.weight3odd10('07017715424'));
      assert.equal(2, checksums.weight3odd10('05543762275'));
      assert.equal(3, checksums.weight3odd10('72225210200'));
    });
  });
});
