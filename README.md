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

## Rewrite

Much of this will be due for a rewrite in the near future. 2.0 might make some
API changes, but I will keep it as close to the original as possible.

Some goals for the rewrite:

- Externalize as much as possible
	- checksum calculations
	- error correcting calculations
- Abstract the drawing part
	- Allow for the 3 ways to accept the data currently implemented
	- Be able to print numbers below barcodes
- Break the process up into more defined and testable steps
	- Check for issues with settings
	- Calculate checksums (if applicable)
	- Create pattern in a data structure
	- Send the pattern to the drawer

I hope to eventually make it more maintainable this way instead of the endless
amounts of spaghetti code.

## License

[The MIT License (MIT)](http://opensource.org/licenses/mit-license.php)
