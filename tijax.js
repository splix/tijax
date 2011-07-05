/*!
 * Tijax - jQuery-style http wrapper for Appcelerator Titanium
 *
 * v 0.2
 */
var TijaxCore = function() {
        this._conn = null;

        this.encode = function(val) {
            return Ti.Network.encodeURIComponent(val);
        };

        this.params = function(data) {
            if (data == null || typeof(data) == 'undefined') {
                return '';
            }
            var x = [];
            for (idx in data) {
                var param = this.encode(idx) + '=' + this.encode(data[idx]);
                x.push(param);
            }
            return x.join('&');
        };

        this.length = function(obj) {
            if (obj == null || typeof(obj) == 'undefined') {
                return 0;
            }
            if (typeof(obj) != 'object') {
                Ti.API.warn("Invalid data type: " + typeof(obj));
                return 0;
            }
            var size = 0, key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) size++;
            }
            return size;
        };

        this.textStatus = function(statusCode) {
            if (statusCode == 200) {
                return 'success'
            }
            return 'error'
        };

        this.logState = function() {
            var http = this._conn;
            Ti.API.error("fail. Status: " + http.status);
            Ti.API.error("fail. ReadyState: " + http.readyState);
            Ti.API.error("fail. Location: " + http.location);
            Ti.API.error("fail. Response: " + http.responseText);
        };

        this.ajax = function(conf) {
            if (conf.type == 'GET' && this.length(conf.data) > 0) {
                if (conf.url.indexOf('?') >= 0) {
                    conf.url = conf.url + '&';
                } else {
                    conf.url = conf.url + '?';
                }
                conf.url = conf.url + this.params(conf.data);
                Ti.API.debug("new url: ", conf.url);
            }
            var http = Ti.Network.createHTTPClient();
            this._conn = http;
            var self = this;

            if (typeof(conf.timeout) == 'number') {
                http.timeout = conf.timeout;
            } else {
                http.timeout = 10000;
            }

            http.onerror = function() {
                self.logState();
                if (typeof(conf.error) == 'function') {
                    conf.error(http, http.status, http.responseText);
                }
                if (typeof(conf.complete) == 'function') {
                    conf.complete(http, 'error');
                }
            };

            if (typeof(conf.onload) == 'function') {
                //used for manual response processing (see .download() method)
                http.onload = function() {
                    conf.onload(http);
                }
            } else {
                http.onload = function() {
                    if (typeof(conf.success) == 'function') {
                        var json = JSON.parse(http.responseText);
                        conf.success(json, self.textStatus(http.status), http);
                    }
                    if (typeof(conf.complete) == 'function') {
                        conf.complete(http, self.textStatus(http.status));
                    }
                    return true;
                }
            }

            http.onsendstream = function(e) {
                Ti.API.debug('Upload progress: ' + e.progress);
            };

            http.open(conf.type, conf.url);
            if (typeof(conf.headers) == 'object') {
                for (name in conf.headers) {
                    http.setRequestHeader(name, conf.headers[name]);
                }
            }
            if (conf.type == 'POST') {
                http.send(conf.data);
            } else {
                http.send();
            }
        };

        this.post = function(conf) {
            conf.type = 'POST';
            this.ajax(conf);
            return this;
        };

        this.get = function(conf) {
            conf.type = 'GET';
            this.ajax(conf);
            return this;
        };

        this.download = function(conf) {
            conf.type = 'GET';
            var file = conf.file;
            conf.onload = function(http) {
                if (http.responseData == null) {
                    return
                }
                if (http.responseData.type == 1) {
                    var f = Ti.Filesystem.getFile(http.responseData.nativePath);
                    if (file.exists()) {
                        file.deleteFile();
                    }
                    f.move(file.nativePath);
                } else {
                    file.write(http.responseData);
                }
                conf.success();
            };
            this.ajax(conf);
            return this;
        }
};

var Tijax = {
    get: function(conf) {
        var tijax = new TijaxCore();
        return tijax.get(conf);
    },
    post: function(conf) {
        var tijax = new TijaxCore();
        return tijax.post(conf);
    },
    ajax: function(conf) {
        var tijax = new TijaxCore();
        return tijax.ajax(conf);
    },
    download: function(conf) {
        var tijax = new TijaxCore();
        return tijax.download(conf);
    }
};