/*
 * Generic barcode drawing functions
 */

var gm = require('gm');

const MODE_BINARY = 0;
const MODE_BARWIDTH = 1;

// constructor
// with defaults
function Barcode1D() {
  this.mode = MODE_BARWIDTH;
  this.width = 0;
  this.height = 0;
  this.background = '#FFF';
  this.barcolor = '#000';
  this.type = 'PNG';
  this.offset = 0;
  this.modulewidth = 1;
}

Barcode1D.MODE_BINARY = MODE_BINARY;
Barcode1D.MODE_BARWIDTH = MODE_BARWIDTH;

/*
 * Convert binary to barwidth (static)
 * This is for compatiblity purposes,
 *
 * @param Sring|Array pattern - binary pattern [1,1,1,0,0,1,0]
 * @return Array - barwidth pattern [3,2,1,1]
 */
Barcode1D.convertToBarwidth = function (pattern) {
  if (!pattern.length) {
    return [];
  }

  var count = 0,
    current = pattern[0],
    ret = [];

  for(var i = 0; i < pattern.length; i++, count++) {
    if (current !== (current = pattern[i])) {
      ret.push(count);
      count = 0;
    }
  }

  ret.push(count);
  return ret;
}

/*
 * set the pattern mode to bar width
 * @return Object (this)
 */
Barcode1D.prototype.modeBarwidth = function () {
  this.mode = MODE_BARWIDTH;
  return this;
};

/*
 * set the pattern mode to binary
 * @return Object (this)
 */
Barcode1D.prototype.modeBinary = function () {
  this.mode = MODE_BINARY;
  return this;
};

/*
 * set the type for output
 * @param String type - file extention of the type
 * @return Object (this)
 */
Barcode1D.prototype.setType = function (type) {
  this.type = type;
  return this;
};

/*
 * set the type for output
 * @param Int width - width of the image
 * @return Object (this)
 */
Barcode1D.prototype.setWidth = function (width) {
  this.width = width;
  return this;
};

/*
 * set the type for output
 * @param Int height - height of the image
 * @return Object (this)
 */
Barcode1D.prototype.setHeight = function (height) {
  this.height = height;
  return this;
};

/*
 * set the pixel width of a single barcode module
 * also calcualtes and sets the offset
 * @param Int basewidth - the width of barcode if the module width was 1px
 * @return Object (this)
 */
Barcode1D.prototype.setModuleWidth = function (basewidth) {
  // bit shift 0 is just a quick way to turn it into an integer
  this.modulewidth = this.width / basewidth >> 0;
  this.offset = this.width % basewidth / 2 >> 0;

  return this;
};

/*
 * Draw using 1d barwiths
 * @param Array pattern = Array of barwidths, alternating between black and white
 * @param function callback
 */
Barcode1D.prototype.draw = function (pattern, callback) {
  var img = gm(this.width, this.height, this.background),
    pos = this.offset,
    draw = true,
    w;

  img.stroke(this.barcolor, 0);

  for (var i = 0; i < pattern.length; i++) {
    //console.log(pattern[i] + ' ' + this.modulewidth);
    w = pattern[i] * this.modulewidth;

    if (draw) {
      // subtract 1 from the x2 pos because drawRectangle adds another pixel on
      // to the end of it, no idea why. The positioning otherwise is fine, i.e.
      // you don't need it in the `w` var.
      img.drawRectangle(pos, 0, pos + w - 1, this.height);
    }

    pos += w;
    draw ^= true;
  }

  img.stream(this.type, function (err, stdout, strerr) {
    callback(err, stdout);
  });
};

module.exports = Barcode1D;
