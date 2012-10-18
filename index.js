/**
 * barcode
 *
 * (c) copyright 2012 Sam Thompson <sam@emberlabs.org>
 * License: The MIT License - http://opensource.org/licenses/mit-license.php
 */

var path = require('path');

/*
 * Barcode fluent class
 */
function BarcodeFluent(type) {
	switch(type.toLowerCase()) {
	//	case 'datamatrix':
		case 'code39':
	//	case 'code128':
	//	case 'codabar':
	//	case 'qrcode':
	//	case 'upc':
			break;
		default:
			throw new Error('Barcode type not supported');
			return;
	}

	this.type = type;
	this._width;
	this._height;
	this._data;

	/*
	 * set width
	 * @param int w - width
	 * @return BarcodeFluent
	 */
	this.width = function(w) {
		this._width = w;
		return this;
	}

	/*
	 * set height
	 * @param int h - height
	 * @return BarcodeFluent
	 */
	this.height = function(h) {
		this._height = h;
		return this;
	}

	/*
	 * set size (shortcut)
	 * @param int h - height
	 * @return BarcodeFluent
	 */
	this.size = function(w, h) {
		this.width(w);
		this.height(h);
		return this;
	}

	this.data = function(d) {
		this._data = d;
		return this;
	}

	this.draw = function(callback) {
		var lib = require('./lib/' + type);
		lib.drawHTML(this._data, this._width, this._height, function(str) {
			callback(str);
		});
	}
}

/*
 * helper
 */
function barcode(type) {
	return new BarcodeFluent(type);
}

module.exports = barcode;
