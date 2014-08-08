var assert = require('assert'),
  stream = require('stream'),
  path = require('path'),
  idx = require('../index'),
  fs = require('fs'),
  os = require('os');

// PNG magic bytes
var pngMagicBytes = new Buffer([0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A]),
  type = 'PNG';

describe('index.js', function () {
  describe('.properties', function () {
    it('should have exports', function () {
      assert.equal('function', typeof idx, 'Main class is missing');
    });
  });

  describe('Barcode', function () {
    it('should create an object with methods', function () {
      var code = new idx('code39', {});
      assert.equal('function', typeof code.getStream, 'getStream is missing');
      assert.equal('function', typeof code.saveImage, 'saveImage is missing');
      assert.equal('function', typeof code.getBase64, 'getBase64 is missing');
    });
  });


  describe('Barcode.getStream', function () {
    it('should return a readable stream', function (done) {
      var code = new idx('code39', {
        width: 400,
        height: 100,
        data: 'hello'
      });

      code.getStream(function (err, readstream) {
        assert.equal(true, !err);
        assert.equal(true, readstream instanceof stream.Readable);
        done();
      });
    });
  });

  // @todo -
  // create testable helper functions to veify it is a PNG
  describe('Barcode.saveImage', function () {
    it('should save a valid image to disk', function (done) {
      var filename = path.join(
        os.tmpdir(),
        'barcodetest-' + new Date().getTime()
      );

      var code = new idx('code39', {
        width: 400,
        height: 100,
        data: 'hello',
        type: type
      });

      code.saveImage(filename, function (err, outfile) {
        assert.equal(true, !err);
        assert.equal(true, fs.existsSync(filename));

        if (!fs.existsSync(filename)) {
          return done();
        }

        fs.open(filename, 'r', function (status, fd) {
          assert.equal(true, !status);
          if (status) {
            fs.unlinkSync(filename);
            return done();
          }

          var buf = new Buffer(8);
          fs.read(fd, buf, 0, 8, 0, function (err, num) {
            assert.equal(true, !err);
            assert.equal(buf.toString('hex'), pngMagicBytes.toString('hex'));

            // don't litter the filesystem with crap
            fs.unlinkSync(filename);
            done();
          });
        });
      });
    });
  });

  // @todo -
  // create testable helper functions to veify it is a PNG
  describe('Barcode.getBase64', function () {
    it('should return a valid base64 encoded image', function (done) {
      var code = new idx('code39', {
        width: 400,
        height: 100,
        data: 'hello',
        type: type
      });

      code.getBase64(function (err, base64) {
        assert.equal(true, !err);

        var pos = base64.indexOf(';base64,');

        assert(true, base64.indexOf(type) != -1);

        if (pos > 0) {
          var buf = new Buffer(base64.substr(pos + 8), 'base64')
            .slice(0, pngMagicBytes.length);

          assert.equal(buf.toString('hex'), pngMagicBytes.toString('hex'));
        }

        done();
      });
    });
  });
});
