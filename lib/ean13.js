/*
 * barcode generator - EAN13 (ISBN)
 */

var gm = require('gm');

const START  = [1,1,1];
const MIDDLE = [1,1,1,1,1];
const END    = [1,1,1];

const LEFT = 0;
const RIGHT = 0;
const GCODE = 1;
const BARMAP = [
  [
    [3,2,1,1], [2,2,2,1], [2,1,2,2], [1,4,1,1], [1,1,3,2],
    [1,2,3,1], [1,1,1,4], [1,3,1,2], [1,2,1,3], [3,1,1,2]
  ],
  [
    [1,1,2,3], [1,2,2,2], [2,2,1,2], [1,1,4,1], [2,3,1,1],
    [1,3,2,1], [4,1,1,1], [2,1,3,1], [3,1,2,1], [2,1,1,3]
  ]
];

/*
 * get check digit
 *
 * @param String seq - Sequence of characters to get the check digit for
 * @return Int - Check digit
 */
function getCheckDigit(seq) {
}

/*
 * generate sequence
 *
 * @param String seq - sequence
 * @param Int|String check - check digit
 * @return Array<Number> - array of barwidth
 */
function generateSequence(seq, check) {
}


function validateOptions(options) {
}
