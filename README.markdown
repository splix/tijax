Tijax - http wrapper for Appcelerator Titanium
==========================================================

Tijax is a jQuery inspired http wrapper for Appcelerator Titanium.

Version: 0.3

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
    success: function(data, status, http) {
        Ti.API.info('Got it ' + JSON.stringify(data));
    },
    error: function(http, status) {
        Ti.API.error('Failed');
    },
    complete: function(http, status) {
        Ti.API.info('Complete');
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
        Ti.API.debug("Image have downloaded into " + targetFile.nativePath);
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
 * timeout - time in millisecond (default is 10000 = 10 seconds)
 * headers - headers for request (map of strings)
 * success - a function to be called if the request successed. Arguments:
   * `data` - map, parsed JSON response
   * `http` - used Ti.Network.HTTPClient
 * error - a function to be called if the request failed. Arguments:
   * `http` - used Ti.Network.HTTPClient
   * `status` - request string, as string with one of following value: forbidden, notfound, notallowed, error
   * `body` - response body, as text
 * complete - a function to be called when the request finished (after success and error callbacks are executed). Arguments:
   * `http` - used Ti.Network.HTTPClient
   * `status` - status of request, values: value: forbidden, notfound, notallowed, error or success

License
-------

Licensed under the Apache License, Version 2.0

Questions?
----------

Have any questions? Contact me: igor@artamonov.ru