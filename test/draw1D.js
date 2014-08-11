var assert = require('assert');
var Barcode1D = require('../lib/utils/draw1D');

describe('barcode.Draw1D', function () {
  describe('.properties', function () {
    it('should have exports', function () {
      assert.equal('function', typeof Barcode1D, 'Barcode1D is missing');
      assert.equal('function', typeof Barcode1D.convertToBarwidth);
      assert.equal('number', typeof Barcode1D.MODE_BARWIDTH);
      assert.equal('number', typeof Barcode1D.MODE_BINARY);
    });
  });

  describe('.convertToBarwidth', function () {
    it('should convert property', function () {
      var original = [1,1,1,0,0,0,1,0,0,1,0,];
      var converted = Barcode1D.convertToBarwidth(original);
      assert.equal( converted.join(','), '3,3,1,2,1,1' );
    });

    it('should take any binary input and convert it property', function () {
      var original = [1,1,2,2,2,1,1,0,0,1,1,0,];
      var converted = Barcode1D.convertToBarwidth(original);
      assert.equal( converted.join(','), '2,3,2,2,2,1' );
    });

    it('should return an empty array when given empty input', function () {
      assert.equal( Barcode1D.convertToBarwidth([]).length, 0 );
    });
  });

  describe('new Barcode1D', function () {
    it('should have defaults', function () {
      var bc = new Barcode1D();
      assert.equal(bc.mode, Barcode1D.MODE_BARWIDTH);
      assert.equal(bc.width, 0);
      assert.equal(bc.height, 0);
      assert.equal(bc.background, '#FFF');
      assert.equal(bc.barcolor, '#000');
      assert.equal(bc.type, 'PNG');
      assert.equal(bc.offset, 0);
      assert.equal(bc.modulewidth, 1);
    });
  });

  describe('Barcode1D.modeBarwidth', function () {
    it('should set the mode to bar-width', function () {
      var bc = new Barcode1D();
      bc.modeBarwidth();
      assert.equal(bc.mode, Barcode1D.MODE_BARWIDTH);
    });
  });

  describe('Barcode1D.modeBinary', function () {
    it('should set the mode to binary', function () {
      var bc = new Barcode1D();
      bc.modeBinary();
      assert.equal(bc.mode, Barcode1D.MODE_BINARY);
    });
  });


  describe('Barcode1D.setType', function () {
    it('should set the supplied image type', function () {
      var bc = new Barcode1D();
      bc.setType('GIF');
      assert.equal(bc.type, 'GIF');
    });
  });

  describe('Barcode1D.setModuleWidth', function () {
    it('should calcuate the modulewidth and offset correctly', function () {
      var bc = new Barcode1D();
      bc.setWidth(300);
      bc.setModuleWidth(55);

      // 300 / 55 = 5.doesn'tMatterHere
      assert.equal(bc.modulewidth, 5);

      // 300 - 55 * 5 = 25, 25/ 2 = 12.5, floor(12.5) = 12
      // aka floor ( 300 mod 55 / 2 )
      assert.equal(bc.offset, 12);
    });
  });
});
