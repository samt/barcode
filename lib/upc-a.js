/*
 * barcode generator - UPC-A
 */

var gm = require('gm'),
  getCheckDigit = require('./utils/checksums').weight3odd10,
  Barcode1D = require('./utils/draw1D');

const START  = [1,1,1];
const MIDDLE = [1,1,1,1,1];
const END    = [1,1,1];
const BARMAP = [
  [3,2,1,1], [2,2,2,1], [2,1,2,2], [1,4,1,1], [1,1,3,2],
  [1,2,3,1], [1,1,1,4], [1,3,1,2], [1,2,1,3], [3,1,1,2]
];

/*
 This is because UPC always has the same formula:
 Start - 3 wide
 Data (x6) - 7 wide
 Middle - 5 wide)
 Data (x5) - 7 wide
 Check - 7 wide
 End - 3 wide
*/
const MODULE_WIDTH = 95;
const FULL_DATA_LEN = 12
const REG_DATA_LEN = 11;

module.exports.createCode = function (options, callback) {
  if (!options.data) {
    return callback(new Error('No data given'), {});
  }

  var userCheckDigit = false;
  options.data = ('' + options.data).replace(/[^0-9]/g, ''); // force to string

  if (options.data.length === FULL_DATA_LEN) {
    userCheckDigit = parseInt(options.data.substr(-1));
    options.data = options.data.substr(0, REG_DATA_LEN)
  }
  else if (options.data.length !== REG_DATA_LEN) {
    return callback(new Error('Data must be 11 digits (0-9) long for UPC-A'), {});
  }

  if (!options.w || !options.h) {
    return callback(new Error('Width and Height must be non-zero'), {});
  }

  var barWidth = options.w / MODULE_WIDTH >> 0;

  if (!barWidth) {
    return callback(new Error('Width will result in a degenerate barcode'), {});
  }

  // @todo externalize this to a function that generates the sequence
  var digit, encoding = [START];
  for (var i = 0; i < options.data.length; i++) {
    // Between position 6 and 7
    if (i == 6) {
      encoding.push(MIDDLE);
    }

    digit = parseInt(options.data[i]);
    encoding.push( BARMAP[ digit ] );
  }

  var checkDigit = getCheckDigit(options.data);

  // we're doing them a service by verifying it for them, the UPC wont work
  // otherwise, and they might have bad data.
  if (userCheckDigit !== false && checkDigit !== userCheckDigit) {
    return callback(new Error('Supplied check digit (digit 12: ' +
      userCheckDigit + ') is incorrect. Correct: ' + checkDigit), {} );
  }

  encoding.push(BARMAP[checkDigit]);
  encoding.push(END);

  // @todo make pattern generation function that ouputs a flat array instead
  // of a 2d array with each digit separate
  var flatPattern = [];
  for(var i=0; i<encoding.length; ++i) {
    flatPattern = flatPattern.concat(encoding[i]);
  }

  new Barcode1D().setWidth(options.w)
    .setHeight(options.h)
    .setModuleWidth(MODULE_WIDTH)
    .draw(flatPattern, callback);
}
