/*
 * Generic 2D barcode drawing functions
 */

var gm = require('gm');

// constructor
// with defaults
function Barcode2D() {
  this.width = 0;
  this.height = 0;
  this.background = '#FFF';
  this.modulecolor = '#000';
  this.type = 'PNG';
  this.leftoffset = 0;
  this.topoffset = 0;
  this.unitwidth = 0;
  this.unitheight = 0;
}

/*
 * set the type for output
 * @param String type - file extention of the type
 * @return Object (this)
 */
Barcode2D.prototype.setType = function (type) {
  this.type = type;
  return this;
};

/*
 * set the type for output
 * @param Int width - width of the image
 * @return Object (this)
 */
Barcode2D.prototype.setWidth = function (width) {
  this.width = width;
  return this;
};

/*
 * set the type for output
 * @param Int height - height of the image
 * @return Object (this)
 */
Barcode2D.prototype.setHeight = function (height) {
  this.height = height;
  return this;
};

/*
 * set the pixel width of a single barcode module
 * also calcualtes and sets the offset
 * @param Int basewidth - the width of barcode if the module width was 1px
 * @return Object (this)
 */
Barcode2D.prototype.setUnitWidth = function (basewidth) {
  // bit shift 0 is just a quick way to turn it into an integer
  this.unitwidth = this.width / basewidth >> 0;
  this.leftoffset = this.width % basewidth / 2 >> 0;

  return this;
};

/*
 * set the pixel height of a single barcode module
 * also calcualtes and sets the offset
 * @param Int basewidth - the width of barcode if the module width was 1px
 * @return Object (this)
 */
Barcode2D.prototype.setUnitHeight = function (baseheight) {
  // bit shift 0 is just a quick way to turn it into an integer
  this.unitheight = this.height / baseheight >> 0;
  this.topoffset = this.height % baseheight / 2 >> 0;

  return this;
};

/*
 * draw barcode
 * @param Array< Array<[0|1]> > pattern - Binary pattern
 * @param callback
 */
Barcode2D.prototype.draw = function (pattern, callback) {

  if (this.unitheight == 0 || this.unitwidth == 0) {
    this.setUnitHeight(pattern.length);
    this.setUnitWidth(pattern[0].length);
  }

  var img = gm(this.width, this.height, this.background),
    posx = this.leftoffset,
    posy = this.topoffset;

  img.stroke(this.modulecolor, 0);

  // outer array is row
  for (var i = 0; i < pattern.length; i++, posy += this.unitheight) {
    // inner is column within a row
    for (var j = posx = 0; j < pattern[i].length; j++, posx += this.unitwidth) {
      // 1 = filled block, 0 = empty block
      if (pattern[i][j]) {
        img.drawRectangle( posx, posy,
          posx + this.unitwidth - 1, posy + this.unitheight - 1);
      }
    }
  }

  img.stream(this.type, function (err, stdout, strerr) {
    callback(err, stdout);
  });
};

module.exports = Barcode2D;
