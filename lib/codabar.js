/**
 * barcode - codabar
 *
 * (c) copyright 2012 Sam Thompson <sam@emberlabs.org>
 * License: The MIT License - http://opensource.org/licenses/mit-license.php
 */

var bmap = {
	'0': [1,0,1,0,1,0,0,1,1],
	'1': [1,0,1,0,1,1,0,0,1],
	'4': [1,0,1,1,0,1,0,0,1],
	'5': [1,1,0,1,0,1,0,0,1],
	'2': [1,0,1,0,0,1,0,1,1],
	'-': [1,0,1,0,0,1,1,0,1],
	'$': [1,0,1,1,0,0,1,0,1],
	'9': [1,1,0,1,0,0,1,0,1],
	'6': [1,0,0,1,0,1,0,1,1],
	'7': [1,0,0,1,0,1,1,0,1],
	'8': [1,0,0,1,1,0,1,0,1],
	'3': [1,1,0,0,1,0,1,0,1],
	'C': [1,0,1,0,0,1,0,0,1,1],
	'*': [1,0,1,0,0,1,0,0,1,1],
	'A': [1,0,1,1,0,0,1,0,0,1],
	'T': [1,0,1,1,0,0,1,0,0,1],
	'D': [1,0,1,0,0,1,1,0,0,1],
	'E': [1,0,1,0,0,1,1,0,0,1],
	'_BN': [1,1,0,1,0,0,1,0,0,1], // reverse
	'B': [1,0,0,1,0,0,1,0,1,1],
	'N': [1,0,0,1,0,0,1,0,1,1],
	'_AT': [1,0,0,1,0,0,1,1,0,1], // reverse
	'_DE': [1,0,0,1,1,0,0,1,0,1], // reverse
	'_C*': [1,1,0,0,1,0,0,1,0,1], // reverse
	'.': [1,1,0,1,1,0,1,1,0,1],
	'/': [1,1,0,1,1,0,1,0,1,1],
	':': [1,1,0,1,0,1,1,0,1,1],
	'+': [1,0,1,1,0,1,1,0,1,1],
};


/*
 * Draw HTML async
 */
function drawHTML(data, size_x, size_y, callback) {
	process.nextTick(function() {
		var dataAry
		  , output = ''
		  , i
		  , j
		  , c
		  , count = 0
		  , barWidth = 5;

		data = 'A' + data + 'B'; 
		dataAry = data.split('');


		output += '<style>.cabar-barcode{height:' + size_y + 'px}.cabar-barcode div{display:inline-block;height:100%;background-color:#FFF"}</style>';
		output += '<div class="cabar-barcode">';
		for(i in dataAry) {
			c = dataAry[i].toUpperCase();

			if (typeof bmap[c] == 'undefined') {
				c = '-';
			}

			if (i) {
				output += '<div style="width:%WIDTH%px"></div>';
				count++;
			}

			for (j in bmap[c]) {
				output += '<div style="width:%WIDTH%px;background-color:#' + ((!bmap[c][j]) ? 'FFF' : '000') + '"></div>';
				count++;
			}
		}
		output += '</div>';
		callback(output.replace(/%WIDTH%/g, parseInt(size_x/count)));
	});
}

module.exports.drawHTML = drawHTML;
