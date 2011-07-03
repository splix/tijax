Tijax - http wrapper for Appcelerator Titanium
==========================================================

Tijax is a jQuery inspired http wrapper for Appcelerator Titanium.

Version: 0.2 (alfa)

Examples
--------

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

How to use
----------

Methods:

 * get - `Tijax.get`
 * post - `Tijax.post`
 * download - `Tijax.download`

Options:

 * url - url for request
 * data - data to be sent (map of strings)
 * headers - headers for request (map of strings)
 * success - a function to be called if the request successed. Arguments: `data` - map, parsed JSON response
 * error - a function to be called if the request failed
 * complete - a function to be called when the request finished (after success and error callbacks are executed)

License
-------

Licensed under the Apache License, Version 2.0

Questions?
----------

Have any questions? Contact me: igor@artamonov.ru