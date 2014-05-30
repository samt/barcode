# barcode generator [![Build Status](https://secure.travis-ci.org/samt/barcode.png)](http://travis-ci.org/samt/barcode)

This library allows you generate image barcodes

## supported types

* [Code39](http://en.wikipedia.org/wiki/Code39)
* [Codabar](http://en.wikipedia.org/wiki/Codabar)
* [DataMatrix](http://en.wikipedia.org/wiki/DataMatrix) (comming soon)
* [Code128](http://en.wikipedia.org/wiki/Code128) (comming soon)
* [QR Code](http://en.wikipedia.org/wiki/QR_Code) (comming soon)
* [UPC](http://en.wikipedia.org/wiki/Universal_Product_Code) (comming soon)

## Installing

	npm install barcode

## Usage

  var barcode = require('barcode');
	var myproduct = new barcode.Code39('00392844283');
	myproduct.saveImage('/tmp/myproduct.png', {
		width: 100,
		height: 40
	}, function (err) {
		// img saved!
	});

	myproduct.getBase64({
		width: 100,
		height: 40,
		type: 'jpg',
		quality: 70
	}, function (err, base64Encoded) {
		// toss it in an image tag.
	});


## License

[The MIT License (MIT)](http://opensource.org/licenses/mit-license.php)

Copyright (c) 2014 Sam Thompson

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
