/*
 * barcode generator
 */

module.exports = {
  Code39: require('./lib/code39.js');
  Code128: {}; // wip
  Codabar: require('./lib/codabar.js');
  DataMatrix: {}; // wip
  QRCode: {}; // wip
  UPC: {}; // wip
};
