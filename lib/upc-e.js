/*
 * barcode generator - UPC-E
 */

var Barcode1D = require('./utils/draw1D'),
  getCheckDigit = require('./utils/checksums').weight3odd10;

// BARMAP[parity][digit]
const BARMAP = [
  [
    [1,1,2,3], [1,2,2,2], [2,2,1,2], [1,1,4,1], [2,3,1,1],
    [1,3,2,1], [4,1,1,1], [2,1,3,1], [3,1,2,1], [2,1,1,3]
  ],
  [
    [3,2,1,1], [2,2,2,1], [2,1,2,2], [1,4,1,1], [1,1,3,2],
    [1,2,3,1], [1,1,1,4], [1,3,1,2], [1,2,1,3], [3,1,1,2]
  ]
];

// PAIRITYMAP[check][lead]
const PAIRITYMAP = [
  [ [0,0,0,1,1,1],[1,1,1,0,0,0] ],
  [ [0,0,1,0,1,1],[1,1,0,1,0,0] ],
  [ [0,0,1,1,0,1],[1,1,0,0,1,0] ],
  [ [0,0,1,1,1,0],[1,1,0,0,0,1] ],
  [ [0,1,0,0,1,1],[1,0,1,1,0,0] ],
  [ [0,1,1,0,0,1],[1,0,0,1,1,0] ],
  [ [0,1,1,1,0,0],[1,0,0,0,1,1] ],
  [ [0,1,0,1,0,1],[1,0,1,0,1,0] ],
  [ [0,1,0,1,1,0],[1,0,1,0,0,1] ],
  [ [0,1,1,0,1,0],[1,0,0,1,0,1] ]
];

const START = [1,1,1];
const END = [1,1,1,1,1,1]

/*
 * This will be the same with all UPC-Es
 *    3  Start
 *   42  Data (6x7)
 * +  6  End
 * ---------------
 *   51  Fixed width
 */
const MODULE_WIDTH = 51;

/*
 * Get a valid UPC-E pattern from UPC-A
 * NOTE: This gets the pattern only! It does not provide you with parity data
 * nor does it provide you with check digits, it ignores all that in the input
 *
 * @param String - UPC-A String
 * @return String - UPC-E code pattern. Empty string if invalid
 */
function fromUpcA(upcastr) {
  var upca = upcastr.split('');

  if (upca.length == 12) {
    upca.pop();
  }

  var first = upca.shift();
  if (upca.length != 10 || first != 1 && first != 0) {
    return '';
  }

  var upcamask = upca.join(''),
    match = null,
    upce = '';

  // case 0-2
  if (match = upcamask.match(/^([0-9]{2})([0-2])0{4}([0-9]{3})$/ )) {
    upce = match[1] + match[3] + match[2];
  }
  // case 3
  else if (match = upcamask.match(/^([0-9]{3})0{5}([0-9]{2})$/)) {
    upce = match[1] + match[2] + '3';
  }
  // case 4
  else if (match = upcamask.match(/^([0-9]{4})0{5}([0-9])$/)) {
    upce = match[1] + match[2] + '4';
  }
  // case 5-9
  else if (match = upcamask.match(/^([0-9]{5})0{4}([5-9])$/)) {
    upce = match[1] + match[2];
  }

  return upce;
}

/*
 * generate sequence
 * @param String pattern
 * @param Number parity
 * @param Number check
 */
function generateSequence(pattern, parity, check) {
  if (pattern.length !== 6) {
    return null;
  }

  check = parseInt(check);
  parity = parseInt(parity);

  var p = PAIRITYMAP[check][parity],
    seq = START;

  for (var i = 0; i < 6; i++) {
    seq = seq.concat( BARMAP[ p[i] ][ parseInt(pattern[i]) ] );
  }

  return seq.concat(END);
}

function createCode(options, callback) {

  if (!options.w || !options.h) {
    return callback(new Error('Width and Height must be non-zero'), {});
  }

  var barWidth = options.w / MODULE_WIDTH >> 0;
  if (!barWidth) {
    return callback(new Error('Width will result in a degenerate barcode'), {});
  }

  var pattern = fromUpcA(options.data),
    parity = parseInt(options.data.substr(0,1));
  var check = getCheckDigit(options.data.substr(0,11));

  if (!pattern || parity > 1) {
    return callback(new Error('UPC-E Requires a valid UPC-A code starting with 0 or 1'), {});
  }

  // NOTE: Sequence is just one long array, not an array of arrays.
  var seq = generateSequence(pattern, parity, check);

  new Barcode1D().setWidth(options.w)
    .setHeight(options.h)
    .setModuleWidth(MODULE_WIDTH)
    .draw(seq, callback);
}

module.exports.generateSequence = generateSequence;
module.exports.createCode = createCode;
module.exports.fromUpcA = fromUpcA;
