/*!
 * Tijax - jQuery-style http wrapper for Appcelerator Titanium
 *
 * v 0.3
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
            if (statusCode == 403) {
                return 'forbidden'
            }
            if (statusCode == 404) {
                return 'notfound'
            }
            if (statusCode == 405) {
                return 'notallowed'
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

        this.configure = function(conf) {
            var self = this;
            if (typeof(conf.timeout) != 'number') {
                conf.timeout = 10000;
            }
            if (typeof(conf.error) != 'function') {
                conf.error = function() {
                    self.logState();
                }
            }
            if (typeof(conf.complete) != 'function') {
                conf.complete = function() {
                }
            }
            if (typeof(conf.onload) != 'function') {
                conf.onload = function() {
                    var http = self._conn;
                    var json = null;
                    if (http.responseText != null && http.responseText.length > 0) {
                        json = eval('(' + http.responseText + ')');
                    }
                    //var status = self.textStatus(http.status);
                    conf.success(json, http);
                    conf.complete(http, 'success');
                }
            } else {
                conf._onload = conf.onload;
                conf.onload = function() {
                    conf._onload(http);
                }
            }
            if (typeof(conf.onsendstream) != 'function') {
                conf.onsendstream = function(e) {
                    Ti.API.debug('Upload progress: ' + e.progress);
                }
            }
            return conf;
        };

        this.ajax = function(conf) {
            conf = this.configure(conf);
            if (conf.type == 'GET' && this.length(conf.data) > 0) {
                if (conf.url.indexOf('?') >= 0) {
                    conf.url = conf.url + '&';
                } else {
                    conf.url = conf.url + '?';
                }
                conf.url = conf.url + this.params(conf.data);
            }
            var http = Ti.Network.createHTTPClient();
            this._conn = http;

            http.timeout = conf.timeout;
            http.onerror = function() {
                var status = self.textStatus(http.status);
                conf.error(http, status, http.responseText);
                conf.complete(http, status);
            };
            http.onload = conf.onload;
            http.onsendstream = conf.onsendstream;

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