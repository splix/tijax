Tijax - http wrapper for Appcelerator Titanium
==========================================================

Tijax is a jQuery inspired http wrapper for Appcelerator Titanium.

Version: 0.2 (alfa)

How to use
--------------

Download and put `tijax.js` into your's Resource directory, and then:


```javascript
Ti.include('tijax.js');

// ....

Tijax.get({
    url: 'http://example.com/url/to/get.json',
    data: {
        param1: 'value',
        param2: 'value'
    },
    success: function(data) {
        Ti.API.info('Got it ' + JSON.stringify(data));
    },
    error: function() {
        error('Failed');
    },
    complete: function() {
        info('Complete');
    }
});

```

or download file:

```javascript
Ti.include('tijax.js');

// ....

Tijax.download({
    url: 'http://example.com/test.jpg',
    file: targetFile,
    success: function() {
        Ti.API.debug("Image from " + url + " have downloaded into " + targetFile.nativePath);
    }
});
```
file from `http://example.com/test.jpg` will be downloaded into local file `targetFile` (must be `Ti.Filesystem.File`)

License
-------

Licensed under the Apache License, Version 2.0

Questions?
----------

Have any questions? Contact me: igor@artamonov.ru