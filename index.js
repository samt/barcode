/*
 * barcode generator
 */

var fs = require('fs'),
  path = require('path');

module.exports = function (moduleName, options) {
  options.data = options.data || '';
  options.barcolor = options.barcolor || '#000';
  options.bgcolor = options.bgcolor || '#FFF';
  options.w = options.width || 0;
  options.h = options.height || 0;
  options.type = (options.type) ? options.type.toUpperCase().trim() : 'PNG';

  return new Barcode(moduleName, options);
}

function Barcode(moduleName, options) {
  this.barcode = require('./lib/' + moduleName.toLowerCase());
  this.options = options;
}

Barcode.prototype.getStream = function (callback) {
  this.barcode.createCode(this.options, function (err, stream) {
    callback(err, stream);
  });
}

Barcode.prototype.saveImage = function (outfile, callback) {
  this.getStream(function (err, stream) {
    if (err) return callback(err, '');

    var ws = fs.createWriteStream(outfile);
    stream.pipe(ws);

    stream.on('end', function () {
      callback(false, outfile);
    });

    stream.on('error', function (err) {
      callback(err, '');
    });
  });
}

Barcode.prototype.getBase64 = function (callback) {
  var type = this.options.type || 'PNG';

  this.getStream(function (err, stream) {
    if (err) return callback(err, '');

    var imgBufs = [];
    stream.on('data', function (chunk) {
      imgBufs.push(chunk);
    });

    stream.on('end', function () {
      var src = 'data:image/' + type + ';base64,';
      src += Buffer.concat(imgBufs).toString('base64');
      callback(false, src);
    });

    stream.on('error', function (err) {
      callback(err, '')
    });
  });
}
