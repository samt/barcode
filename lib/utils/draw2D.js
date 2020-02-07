/*
 * Generic 2D barcode drawing functions
 *
 * Some terms used in here:
 * ****************************************************************************
 * - Unit: A single barcode module.
 *   In the event of a 1D bar-code, this is the width of the smallest possible
 *   unit, whereby other bar widths are created by multiplying some coefficient
 *   onto this width. In the case of a 2D block-code, this is the unit width/
 *   height that will be used to make the smallest possible block.
 * ****************************************************************************
 * - Width: Width of the canvas the barcode will be drawn on
 * ****************************************************************************
 * - Height: Height of the cavas the barcode will be drawn on.
 * ****************************************************************************
 * - Offset: Top or left offset, relative to the canvase, to begin drawing the
 *   barcode on.
 * ****************************************************************************
 * - Basewidth: The width of the barcode if each "Unit" was only 1px
 * ****************************************************************************
 * - Baseheight: The height of the barcode if each "Unit" was only 1px
 * ****************************************************************************
 *
 * Notes:
 *
 * Upon setting a width/height, it will attempt to default the unit widths and
 * offsets if they have not been set yet. Simply call bc.setUnitWidth() with
 * your baseheight.
 */

var gm = require('gm').subClass({ imageMagick: true });

/*
 * Basic constructor
 *
 */
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
 * Set the type for output
 *
 * @param String type - file extention of the type, must be supported by GM
 * @return Object (this)
 */
Barcode2D.prototype.setType = function (type) {
  this.type = type;
  return this;
};

/*
 * Set the width of the canvas
 *
 * @param Number width - width of the image
 * @return Object (this)
 */
Barcode2D.prototype.setWidth = function (width) {
  this.width = width;

  if (!this.unitwidth && width) {
    this.setUnitHeight(width);
  }

  return this;
};

/*
 * Set the height of the canvas
 *
 * @param Number height - height of the image
 * @return Object (this)
 */
Barcode2D.prototype.setHeight = function (height) {
  this.height = height;

  if (!this.unitheight && height) {
    this.setUnitHeight(height);
  }

  return this;
};

/*
 * Set the pixel width of a barcode.
 * Note: This method does not actually accept the unit width, instead it accepts
 * the basewidth (see defns above) and it will calcuate the unit for you.
 *
 * @param Number basewidth - the width of barcode if the module width was 1px
 * @return Object (this)
 */
Barcode2D.prototype.setUnitWidth = function (basewidth) {
  this.unitwidth = this.width / basewidth >> 0;
  this.leftoffset = this.width % basewidth / 2 >> 0;
  return this;
};

/*
 * Set the pixel height of a barcode.
 * Note: This method does not actually accept the unit height, instead it accepts
 * the baseheight (see defns above) and it will calcuate the unit it for you.
 *
 * @param Number baseheight - the height of barcode if the module width was 1px
 * @return Object (this)
 */
Barcode2D.prototype.setUnitHeight = function (baseheight) {
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
