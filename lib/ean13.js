/*
 * barcode generator - EAN13 (ISBN)
 */

var gm = require('gm'),
  getCheckDigit = require('./utils/checksums').weight3even10,
  Barcode1D = require('./utils/draw1D');

const START  = [1,1,1];
const MIDDLE = [1,1,1,1,1];
const END    = [1,1,1];

const LEFT = 0;
const RIGHT = 0;
const GCODE = 1;
const BARMAP = [
  [
    [3,2,1,1], [2,2,2,1], [2,1,2,2], [1,4,1,1], [1,1,3,2], // L/R
    [1,2,3,1], [1,1,1,4], [1,3,1,2], [1,2,1,3], [3,1,1,2]
  ],
  [
    [1,1,2,3], [1,2,2,2], [2,2,1,2], [1,1,4,1], [2,3,1,1], // G
    [1,3,2,1], [4,1,1,1], [2,1,3,1], [3,1,2,1], [2,1,1,3]
  ]
];

const ENCODE_GROUPS = [
  [0,0,0,0,0,0],
  [0,0,1,0,1,1],
  [0,0,1,1,0,1],
  [0,0,1,1,1,0],
  [0,1,0,0,1,1],
  [0,1,1,0,0,1],
  [0,1,1,1,0,0],
  [0,1,0,1,0,1],
  [0,1,0,1,1,0],
  [0,1,1,0,1,0]
];

/*
 EAN13 has the same format, which happens to be the same as UPC.
 This is also one of the reasons why EAN13 codes starting with 0 are also valid
 UPC codes.

 Start - 3 wide
 Data (x6) - 7 wide
 Middle - 5 wide)
 Data (x5) - 7 wide
 Check - 7 wide
 End - 3 wide
*/
const MODULE_WIDTH = 95;

/*
 * generate ean13 sequence
 *
 * @param String seq - sequence
 * @param Int|String check - check digit
 * @return Array<Number> - array of barwidth
 */
function generateSequence(seq, check) {
  seq = seq.substr(0,12) + '' + check;

  var first = seq.substr(0,1),
    group1 = seq.substr(1,6),
    group2 = seq.substr(7);

  var left = [],
    right = [],
    enc = ENCODE_GROUPS[parseInt(first)],
    dInt;

  for (var i = 0; i < 6; i++) {
    dInt = parseInt(group1[i]);
    left = left.concat( BARMAP[ enc[i] ][ dInt ] );
  }

  for (var i = 0; i < 6; i++) {
    dInt = parseInt(group2[i])
    right = right.concat( BARMAP[RIGHT][ dInt ]   );
  }

  return [].concat(START, left, MIDDLE, right, END);
}

function createCode(options, callback) {
  if (!options.data) {
    return callback(new Error('No data given'), {});
  }

  if (!options.w || !options.h) {
    return callback(new Error('Width and Height must be non-zero'), {});
  }

  var check = getCheckDigit(options.data.substr(0,12));
  var sequence = generateSequence(options.data, check);

  new Barcode1D().setWidth(options.w)
    .setHeight(options.h)
    .setModuleWidth(MODULE_WIDTH)
    .draw(sequence, callback);
}

module.exports.generateSequence = generateSequence;
module.exports.createCode = createCode;
