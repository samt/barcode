/*
 * Various checksum calculations
 *
 */

/*
 * weight3odd10
 *
 * Calculates the checksum, odds have a weight of 3, then MOD 10.
 *
 * @param String seq - Sequence of int to find the checksum of
 * @param Number - Checksum
 *
 * Used by:
 * - UPC-A
 * - UPC-E
 * - EAN8
 */
function weight3odd10(seq) {
  var dInt, ret = 0;

  // Using a 1-index for this simply because we can match the position in the
  // sequence with our counter variable.
  for (var i = 1; i <= seq.length; i++) {
    dInt = parseInt(seq[i - 1]);
    ret += (i & 1) ? dInt * 3 : dInt;
  }

  return (10 - ret % 10) % 10;
}


/*
 * weight3even10
 *
 * Calculates the checksum, evens have a weight of 3, then MOD 10.
 * What's funny about this is that we can simply prepend a 0 to the sequence
 * to shift the odds to the evens then pass it weight3odd().
 *
 * @param String seq - Sequence of ints to find the checksum of
 * @param Number - Checksum
 *
 * Used by:
 * - EAN13
 */
function weight3even10(seq) {
  return weight3odd10('0' + seq);
}


/*
 * Our exports
 */
module.exports.weight3odd10 = weight3odd10;
module.exports.weight3even10 = weight3even10;
