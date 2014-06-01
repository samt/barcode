/*
 * barcode generator - code39
 */

var gm = require('gm');

const bmap = {
	' ': [0,1,1,0,0,0,1,0,0],
	'$': [0,1,0,1,0,1,0,0,0],
	'%': [0,0,0,1,0,1,0,1,0],
	'*': [0,1,0,0,1,0,1,0,0], // Start/stop marker
	'+': [0,1,0,0,0,1,0,1,0],
	'|': [0,1,0,0,0,0,1,0,1],
	'.': [1,1,0,0,0,0,1,0,0],
	'/': [0,1,0,1,0,0,0,1,0],
	'-': [0,1,0,0,0,0,1,0,1],
	'0': [0,0,0,1,1,0,1,0,0],
	'1': [1,0,0,1,0,0,0,0,1],
	'2': [0,0,1,1,0,0,0,0,1],
	'3': [1,0,1,1,0,0,0,0,0],
	'4': [0,0,0,1,1,0,0,0,1],
	'5': [1,0,0,1,1,0,0,0,0],
	'6': [0,0,1,1,1,0,0,0,0],
	'7': [0,0,0,1,0,0,1,0,1],
	'8': [1,0,0,1,0,0,1,0,0],
	'9': [0,0,1,1,0,0,1,0,0],
	'A': [1,0,0,0,0,1,0,0,1],
	'B': [0,0,1,0,0,1,0,0,1],
	'C': [1,0,1,0,0,1,0,0,0],
	'D': [0,0,0,0,1,1,0,0,1],
	'E': [1,0,0,0,1,1,0,0,0],
	'F': [0,0,1,0,1,1,0,0,0],
	'G': [0,0,0,0,0,1,1,0,1],
	'H': [1,0,0,0,0,1,1,0,0],
	'I': [0,0,1,0,0,1,1,0,0],
	'J': [0,0,0,0,1,1,1,0,0],
	'K': [1,0,0,0,0,0,0,1,1],
	'L': [0,0,1,0,0,0,0,1,1],
	'M': [1,0,1,0,0,0,0,1,0],
	'N': [0,0,0,0,1,0,0,1,1],
	'O': [1,0,0,0,1,0,0,1,0],
	'P': [0,0,1,0,1,0,0,1,0],
	'Q': [0,0,0,0,0,0,1,1,1],
	'R': [1,0,0,0,0,0,1,1,0],
	'S': [0,0,1,0,0,0,1,1,0],
	'T': [0,0,0,0,1,0,1,1,0],
	'U': [1,1,0,0,0,0,0,0,1],
	'V': [0,1,1,0,0,0,0,0,1],
	'W': [1,1,1,0,0,0,0,0,0],
	'X': [0,1,0,0,1,0,0,0,1],
	'Y': [1,1,0,0,1,0,0,0,0],
	'Z': [0,1,1,0,1,0,0,0,0]
};

const NARROW_BAR = 20;
const WIDE_BAR = 55;
const QUIET_BAR = 35;
const SYM_LEN = 6 * NARROW_BAR + 3 * WIDE_BAR + QUIET_BAR;

function Code39(data, options) {
  this.options = {
    w: options.width || 0,
    h: options.height || 0,
    bcolor: options.barcolor || '#000000',
    qcolor: options.quietcolor || '#FFFFFF'
  }

  if (!this.options.w || !this.options.h) {
    throw new Error('Width and Height must be non-zero');
  }

  this.data = ('*' + data + '*').toUpperCase();
  var wQuotient = this.options.w / (this.data.length * SYM_LEN - QUIET_BAR);

  this.nBarWidth = NARROW_BAR * wQuotient >> 0;
	this.wBarWidth = WIDE_BAR * wQuotient >> 0;
	this.qBarWidth = QUIET_BAR * wQuotient >> 0;

  console.log("nbar: " + this.nBarWidth);
  console.log("wbar: " + this.wBarWidth);
  console.log("qbar: " + this.qBarWidth);

  if (this.nBarWidth < 1 || this.qBarWidth == this.nBarWidth) {
    throw new Error('Current settings will result in a degenerate barcode');
  }
}

Code39.prototype.saveImage = function (outfile, callback) {
  var img = gm(this.options.w, this.options.h, this.options.qcolor),
    count = 0,
    pos = 0,
    ch,
    w;

  for(var k in this.data) {
    if (count++) {
      pos += this.qBarWidth;
    }

    ch = bmap[this.data[k]] || bmap[' '];
    for(var j in ch) {
      w = ch[j] ? this.wBarWidth : this.nBarWidth;

      if ( !(j % 2) ) {
        img.strokeWidth(1);
        // workaround for GM - cannot set gravity on stroke
        for (var m = 0; m < w; m++) {
          img.drawLine(pos + m, 0, pos + m, this.options.h);
        }
      }

      pos += w;
    }
  }

  img.write(outfile, function (err) {
    callback(err, outfile);
  });
}

Code39.prototype.getBase64 = function (callback) {
}

Code39.prototype.getStream = function (callback) {
}

module.exports = Code39;
