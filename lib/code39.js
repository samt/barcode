/**
 * barcode - code39
 *
 * (c) copyright 2012 Sam Thompson <sam@emberlabs.org>
 * License: The MIT License - http://opensource.org/licenses/mit-license.php
 */

var bmap = {
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

var NARROW_BAR	= 20;
var WIDE_BAR	= 55;
var QUIET_BAR	= 35;

/*
 * Draw HTML async
 */
function drawHTML(data, size_x, size_y, callback) {
	process.nextTick(function() {
		var dataAry
		  , output = ''
		  , i
		  , j
		  , c;
		data = '*' + data + '*';
		var widthQuotient = size_x / (data.length * (6 * NARROW_BAR + 3 * WIDE_BAR + QUIET_BAR) - QUIET_BAR);
		var nBarWidth = parseInt(NARROW_BAR * widthQuotient);
		var wBarWidth = parseInt(WIDE_BAR * widthQuotient);
		var qBarWidth = parseInt(QUIET_BAR * widthQuotient);

		if (nBarWidth < 1 ||
			wBarWidth < 1 ||
			qBarWidth < 1 ||
			nBarWidth == wBarWidth ||
			nBarWidth == qBarWidth ||
			wBarWidth == qBarWidth)
		{
			throw new Error('Barcode dimmentions will produce a degenerate barcode. Increase the pixel size or decrease your data size');
			return;
		}

		dataAry = data.split('');
		output += '<style>.c39-barcode{height:' + size_y + 'px}.c39-barcode div{display:inline-block;height:100%;background-color:#FFF"}</style>';
		output += '<div class="c39-barcode">';
		for(i in dataAry) {
			c = dataAry[i].toUpperCase();

			if (typeof bmap[c] == 'undefined') {
				c = ' ';
			}

			if (i) {
				output += '<div style="width: ' + qBarWidth + 'px"></div>';
			}

			for (j in bmap[c]) {
				output += '<div style="width:' + ((bmap[c][j]) ? wBarWidth : nBarWidth) + 'px;background-color:#' + ((j % 2) ? 'FFF' : '000') + '"></div>';
			}
		}
		output += '</div>';
		callback(output);
	});
}

module.exports.drawHTML = drawHTML;
