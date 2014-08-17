/*
 * barcode generator - DataMatrix
 */

var Barcode2D = require('./utils/draw2D');

function generateSequence(bytes) {
  var sequence = [],
    next, // look ahead for digit pairs
    charCode;

  for (var i = 0; i < bytes.length; i++) {
    next = bytes.charAt(i + 1);
    charCode = bytes.charCodeAt(i);

    // number pair
    if (next.length && c1 + c2 == parseInt(c1 + c2)) {
      i++;
      sequence.push(130 + parseInt(c1 + c2));
    }
    // ASCII value
    else if (charCode < 128) {
      sequence.push(charCode + 1); // ASCII vals = char + 1
    }
  }
}

function createCode(options, callback) {
  if (!options.w || !options.h) {
    return callback(new Error('Width and Height must be non-zero'), {});
  }


}
