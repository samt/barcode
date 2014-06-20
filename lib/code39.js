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

module.exports.createCode = function (options, callback) {

  if (!options.w || !options.h) {
    return callback(new Error('Width and Height must be non-zero'), {});
  }

	options.data = options.data.trim();
	if (!options.data) {
		return callback(new Error('No data given'), {});
	}

  options.data = ('*' + options.data + '*').toUpperCase();
  var wQuotient = options.w / (options.data.length * SYM_LEN - QUIET_BAR);

  var nBarWidth = NARROW_BAR * wQuotient >> 0;
  var wBarWidth = WIDE_BAR * wQuotient >> 0;
  var qBarWidth = QUIET_BAR * wQuotient >> 0;

  if (nBarWidth < 1 || qBarWidth == nBarWidth) {
    return callback(new Error('Current settings will result in a ' +
      'degenerate barcode'), {});
  }

  var img = gm(options.w, options.h, options.bgcolor),
    count = 0,
    pos = 0,
    ch,
    w;

  img.stroke(options.barcolor, 1);

  for(var k in options.data) {
    if (count++) {
      pos += qBarWidth;
    }

    ch = bmap[options.data[k]] || bmap[' '];
    for(var j in ch) {
      w = ch[j] ? wBarWidth : nBarWidth;

      if ( !(j % 2) ) {
        // workaround for GM - cannot set gravity on stroke
        for (var m = 0; m < w; m++) {
          img.drawLine(pos + m, 0, pos + m, options.h);
        }
      }

      pos += w;
    }
  }

  img.stream(options.type, function (err, stdout, stderr) {
    callback(err, stdout);
  });
};
