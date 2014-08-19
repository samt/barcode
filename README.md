# barcode generator [![Build Status](https://secure.travis-ci.org/samt/barcode.png)](http://travis-ci.org/samt/barcode)

Generate 1D and 2D barcodes

## Supported 1D types

* [Code39](http://en.wikipedia.org/wiki/Code39)
* [Codabar](http://en.wikipedia.org/wiki/Codabar)
* [Code128](http://en.wikipedia.org/wiki/Code128)
* [UPC-A](http://en.wikipedia.org/wiki/Universal_Product_Code)
* [UPC-E](http://en.wikipedia.org/wiki/Universal_Product_Code#UPC-E)
* [EAN-13](http://en.wikipedia.org/wiki/EAN)


## Supported 2D types

* [QR Code](http://en.wikipedia.org/wiki/QR_Code) (comming soon)
* [DataMatrix](http://en.wikipedia.org/wiki/DataMatrix) (comming soon)
* [PDF417](http://en.wikipedia.org/wiki/PDF417) (comming soon)

## Requirements

- A working installation of [GraphicsMagick](http://www.graphicsmagick.org/).
- node >= 0.10.0

## Installing

	npm install barcode

## Usage

Set it up and specify your type and options. The following 3 are the only
required ones.

```javascript
var barcode = require('barcode');
var code39 = barcode('code39', {
	data: "it works",
	width: 400,
	height: 100,
});
```

Next choose from the three methods below how you want to output your barcode.

**Stream**

Get a stream of the final image data. you can collect this and save out a new
PNG (default type), pipe it elsewhere, or save it to a CDN.

```javascript
code39.getStream(function (err, readStream) {
	if (err) throw err;

	// 'readStream' is an instance of ReadableStream
	readStream.pipe(CdnWriteStream);
});
```

**File to disk**

Save an image out to the file system, pretty simple. Just be sure to specify
your outfile.

```javascript
var outfile = path.join(__dirname, 'imgs', 'mycode.png')
code39.saveImage(outfile, function (err) {
	if (err) throw err;

	console.log('File has been written!');
});
```

**Base64 encoded `img` src**

Often times, barcodes are single use for a single print or whatever. With this
method, we can create one on the fly and just send the base64 encoded image to
the browser through the HTML.

```javascript
code39.getBase64(function (err, imgsrc) {
	if (err) throw err;

	// if we're using HTTP or another framework
	res.end('<img src="' + imgsrc + '">');
});
```

## Refactor

Much of the underlying code for the generation is being rewritten, however the
API will remain the same. As a rule, anything new will have to be testable.

Things todo:

- Move all checksums and ECC to a module in lib/utils
- Use the new barcode generation class: Barcode2D.js
- Remove uses of Barcode1D and in-place image generation
- Create separate functions for generating sequences

In the future:

- Abstract drawing to be able to draw with `gm` or output html (bars with css
	or canvas)

## License

[The MIT License (MIT)](http://opensource.org/licenses/mit-license.php)
