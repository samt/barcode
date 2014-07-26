/*
 * barcode generator - UPC-A
 */

var gm = require('gm');

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

/*
 * get the check digit of a string
 *
 * @param String data - Numeric string of numbers
 * @return int - Check digit. -1 if failure
 */
function getCheckDigit(data) {
  var checksum = 0,
    nData;
  // we will never have a UPC-A code with anything different than 11 digits not
  // including the check digit (which is what we happen to be calculating)
  for (var i = 0; i < REG_DATA_LEN; i++) {

    if ( typeof data[i] !== 'string' ) {
      return -1;
    }

    nData = parseInt(data[i]);
    // If i is odd (pos is even), add the digit
    // If i is even (pos is odd), add the digit x 3
    checksum += (i & 1) ? nData : 3 * nData;
  }

  return (10 - checksum % 10) % 10;
}

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

  var img = gm(options.w, options.h, options.bgcolor),
    count = 0,
    draw = true,
    h = options.h,
    pos = (options.w - MODULE_WIDTH * barWidth) / 2 >> 0,
    w;

  img.stroke(options.barcolor, 1);

  // This for loop below looks at each symbol.
  for (var i = 0; i < encoding.length; i++) {

    // This for loop below looks each bar
    for (var j = 0; j < encoding[i].length; j++) {
      w = encoding[i][j] * barWidth;

      // @todo - add option to print numbers under the barcode, with varying
      // height to allow for number placement below the code and between bars
      if (draw) {
        // This for loop looks each module the bar is composed of
        // work around for graphicsmagick, who cant set gravity on drawn lines.
        for (var k = 0; k < w; k++) {
          img.drawLine(pos + k, 0, pos + k, h);
        }
      }

      pos += w;
      draw ^= true;
    }
  }


  img.stream(options.type, function (err, stdout, stderr) {
    callback(err, stdout);
  });
}

module.exports.getCheckDigit = getCheckDigit;
