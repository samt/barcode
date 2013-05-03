/**
 * barcode
 *
 * (c) copyright 2012 Sam Thompson <sam@emberlabs.org>
 * License: The MIT License - http://opensource.org/licenses/mit-license.php
 */


function BarcodeFluent(type) {

	//type arrays are a touch faster that switch case blocks
	supportedTypes = {
		'code39': true,
		'codabar': true,
		'code128': false,
		'qrcode': false,
		'upc': false,
		'datamatrix': false,
	}

	if(!supportedTypes[type.toLowerCase()]) { throw new Error('Barcode type not supported'); return false;}

	return  {

		/*Sets the type of barcode*/
		type: function(t){
			if(supportedTypes[t.toLowerCase()]) { this.lib =  require('./lib/'+t.toLowerCase()); }
			return this;
		},

		/*sets the library to use*/
		lib: require('./lib/'+type.toLowerCase()),

		/*
		* set width
		* @param int w - width
		* @return BarcodeFluent
		*/
		width: function(w){
			this._width = w;
			return this;
		},

		/*
		* set height
		* @param int h - height
		* @return BarcodeFluent
		*/
		height: function(h) {
			this._height = h;
			return this;
		},

		/*
		* set size (shortcut)
		* @param int h - height
		* @return BarcodeFluent
		*/
		size: function(w, h) {
			this.width(w);
			this.height(h);
			return this;
		},

		/*
		* set data
		* @param string d - data
		* @return BarcodeFluent
		*/
		data: function(d) {
			this._data = d;
			return this;
		},

		/*
		* return barcode string
		* @param function c - Callback function
		* @return BarcodeFluent
		*/
		draw: function(c) {
			this.lib.drawHTML(this._data, this._width, this._height, function(str) {
				(c||function(){})(str);
			});
			return this;
		}
	}

}

module.exports = BarcodeFluent;

