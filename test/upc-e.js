var assert = require('assert');
var upc_e = require('../lib/upc-e');

describe('UPC-E', function () {
  describe('.properties', function () {
    it('should have exports', function () {
      assert.equal('function', typeof upc_e.createCode, 'createCode is missing');
      assert.equal('function', typeof upc_e.fromUpcA, 'fromUpcA is missing');
      assert.equal('function', typeof upc_e.generateSequence, 'generateSequence is missing');
    });
  });

  describe('.fromUpcA()', function () {
    it('should form a valid UPC-E code from a compatible UPC-A code', function () {
      assert.equal('224330', upc_e.fromUpcA('12200000433'));
      assert.equal('451121', upc_e.fromUpcA('04510000112'));
      assert.equal('677612', upc_e.fromUpcA('16720000761'));
      assert.equal('305873', upc_e.fromUpcA('03050000087'));
      assert.equal('691764', upc_e.fromUpcA('16917000006'));
      assert.equal('554875', upc_e.fromUpcA('05548700005'));
      assert.equal('230816', upc_e.fromUpcA('12308100006'));
      assert.equal('332957', upc_e.fromUpcA('03329500007'));
      assert.equal('490358', upc_e.fromUpcA('04903500008'));
      assert.equal('720749', upc_e.fromUpcA('17207400009'));
    });

    it('should return empty when faced with an incompatible UPC-A code', function () {
      assert.equal('', upc_e.fromUpcA('04878943035'));
      assert.equal('', upc_e.fromUpcA('05543762275'));
      assert.equal('', upc_e.fromUpcA('07017715424'));
    });

    it('should return empty when faced with an impossible UPC-A code', function () {
      assert.equal('', upc_e.fromUpcA('92874'));
      assert.equal('', upc_e.fromUpcA('3543392849393'));
      assert.equal('', upc_e.fromUpcA('THIS IS NOT A UPC CODE'));
    });
  });

  describe('.generateSequence()', function () {
    it('should generate a proper UPC-E sequence (odd parity)', function () {
      var comp = [1,1,1,1,1,1,4,2,1,3,1,1,3,1,2,4,1,1,1,1,2,2,2,2,1,2,2,1,1,1,1,1,1];
      var gen = upc_e.generateSequence('677612', '1', '8');

      assert.equal(comp.length, gen.length);

      for (var i = 0; i < comp.length; i++) {
        assert.equal(comp[i], gen[i]);
      }
    });

    it('should generate a proper UPC-E sequence (even parity)', function () {
      var comp = [1,1,1,2,3,1,1,2,1,1,3,3,2,1,1,1,1,4,1,1,2,3,1,1,2,1,3,1,1,1,1,1,1];
      var gen = upc_e.generateSequence('490358', '0', '1');

      assert.equal(comp.length, gen.length);

      for (var i = 0; i < comp.length; i++) {
        assert.equal(comp[i], gen[i]);
      }
    });
  });
});
