# barcode

This library allows you generate HTML barcodes.
Full support for Image generation is coming soon.

Version is *0.0.2-dev*

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

From `NodeJS`
```
	barcodeLib = require('barcode');
	
	var barcode = barcodeLib('code39'); // sets the barcode type (code39 in this case)
	.size(200,100) //sets the width to 200px wide by 100px high
	.draw(function(str){ //returns a string containing the barcode as html
		document.write(str); //write it to DOM
	});
```

## License

[The MIT License (MIT)](http://opensource.org/licenses/mit-license.php)

Copyright (c) 2012 Sam Thompson

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
