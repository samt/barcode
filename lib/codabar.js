/*
 * barcode generator - codabar
 */

var gm = require('gm');

var bmap = {
	'0': [0,0,0,0,0,1,1],
	'1': [0,0,0,0,1,1,0],
	'4': [0,0,1,0,0,1,0],
	'5': [1,0,0,0,0,1,0],
	'2': [0,0,0,1,0,0,1],
	'-': [0,0,0,1,1,0,0],
	'$': [0,0,1,1,0,0,0],
	'9': [1,0,0,1,0,0,0],
	'6': [0,1,0,0,0,0,1],
	'7': [0,1,0,0,1,0,0],
	'8': [0,1,1,0,0,0,0],
	'3': [1,1,0,0,0,0,0],
	'C': [0,0,0,1,0,1,1],
	'*': [0,0,0,1,0,1,1],
	'A': [0,0,1,1,0,1,0],
	'T': [0,0,1,1,0,1,0],
	'D': [0,0,0,1,1,1,0],
	'E': [0,0,0,1,1,1,0],
	'B': [0,1,0,1,0,0,1],
	'N': [0,1,0,1,0,0,1],
	'.': [1,0,1,0,1,0,0],
	'/': [1,0,1,0,0,0,1],
	':': [1,0,0,0,1,0,1],
	'+': [0,0,1,0,1,0,1],
};

const NARROW_RATIO = 10;
const WIDE_RATIO = 25;

module.exports.createCode = function (options, callback) {
  options.start = options.start || 'A';
  options.stop = options.stop || 'B';

	if (!options.w || !options.h) {
		return callback(new Error('Width and Height must be non-zero'), {});
	}

  options.data = (options.start + options.data + options.stop)
    .toUpperCase().replace(/[^0-9A-ENT*:+\/\.\$\-]/g, '').trim();

	if (!options.data) {
		return callback(new Error('No data given'), {});
	}

  var wideBars = 0,
    narrowBars = 0,
    wideBarTmp;
  for (var i in options.data) {
    wideBarTmp = bmap[options.data[i]].join().match(/1/g).length % 2 ? 3 : 2;
    wideBars += wideBarTmp;
    narrowBars += 7 - wideBarTmp;

    if (i) narrowBars++;
  }

  var wQuotient = options.w / (narrowBars * NARROW_RATIO + wideBars * WIDE_RATIO);
  var nBarWidth = NARROW_RATIO * wQuotient >> 0;
  var wBarWidth = WIDE_RATIO * wQuotient >> 0;

  if (nBarWidth < 1 || wBarWidth == nBarWidth) {
    return callback(new Error('Current settings will result in a ' +
      'degenerate barcode'), {});
  }

  var img = gm(options.w, options.h, options.bgcolor),
    count = 0,
    pos = 0,
    ch,
    w;

  img.stroke(options.barcolor, 1);

  for (var i in options.data) {
    if (count++) {
      pos += nBarWidth;
    }

    ch = bmap[options.data[i]] || bmap['-'];
    for (var k in ch) {
      w = ch[k] ? wBarWidth : nBarWidth;

      if ( !(k % 2) ) {
        for (var j = 0; j < w; j++) {
          img.drawLine(pos + j, 0, pos + j, options.h);
        }
      }

      pos += w;
    }
  }

  img.stream(options.type, function (err, stdout, stderr) {
    callback(err, stdout);
  });
}
