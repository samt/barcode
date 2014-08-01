
/*
 * Used by UPC, ISBN/EAN
 *
 */
function weight3CheckDigit(data) {
  var checksum = 0,
    nData;

  for (var i = 0; i < data.length; i++) {

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

/*
 * Used by code128
 */
function linearMod103(data) {
  if (data.length < 2) {
    return null;
  }

  var checksum = 0,
    aryData = data.split('');

  // first two are x1, then it continues form there.
  checksum += parseInt(data.shift());

  for (var i = 0; i < aryData.length; i++) {
    checksum += (i + 1) * parseInt(aryData[i]);
  }

  return checksum % 103;
}

module.exports.weight3CheckDigit = weight3CheckDigit;
module.exports.linearMod103 = linearMod103;
