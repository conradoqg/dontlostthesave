var fs = require('fs-extra');
var pathNode = require('path');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var testPaths = {
    dnsPath: pathNode.resolve(process.cwd(), 'test/source'),
    savesPath: pathNode.resolve(process.cwd(), 'test/destination')
};

var Settings = function (path) {
    this.path = path;
    EventEmitter.call(this);
};

util.inherits(Settings, EventEmitter);

if (process.argv.indexOf('--dev') >= 0) {
    Settings.prototype.exists = function () {
        return true;
    };

    Settings.prototype.valid = function () {
        return true;
    };

    Settings.prototype.validDNSPath = function () {
        return true;
    };

    Settings.prototype.validSavesPath = function () {
        return true;
    };

    Settings.prototype.get = function () {
        return testPaths;
    };

    Settings.prototype.getDNSPath = function () {
        return testPaths.dnsPath;
    };

    Settings.prototype.setDNSPath = function () {
        return testPaths.dnsPath;
    };

    Settings.prototype.getSavesPath = function () {
        return testPaths.savesPath;
    };

    Settings.prototype.setSavesPath = function () {
        return testPaths.savesPath;
    };

    Settings.prototype.getState = function () {
        return testPaths.state;
    };

    Settings.prototype.setState = function (state) {
        return testPaths.state = state;
    };

} else {
    Settings.prototype.exists = function () {
        try {
            fs.readJsonSync(this.path);
            return true;
        } catch (e) {
            return false;
        }
    };

    Settings.prototype.valid = function () {
        return this.validDNSPath() && this.validSavesPath();
    };

    Settings.prototype.validDNSPath = function () {
        return fs.existsSync(this.getDNSPath());
    };

    Settings.prototype.validSavesPath = function () {
        return fs.existsSync(this.getSavesPath());
    };

    Settings.prototype.get = function () {
        try {
            var json = fs.readJsonSync(this.path);
            return json;
        } catch (e) {
            return {
                dnsPath: null,
                savesPath: null
            };
        }
    };

    Settings.prototype.getDNSPath = function () {
        try {
            var json = fs.readJsonSync(this.path);
            return json.dnsPath;
        } catch (e) {
            return null;
        }
    };

    Settings.prototype.setDNSPath = function (path) {
        try {
            var json = {};
            if (this.exists()) json = fs.readJsonSync(this.path);
            json.dnsPath = path;
            fs.ensureDir(pathNode.dirname(this.path));
            fs.writeJsonSync(this.path, json);
            this.emit('dnsPathChanged', json.dnsPath);
            return json.dnsPath;
        } catch (e) {
            return null;
        }
    };

    Settings.prototype.getSavesPath = function () {
        try {
            var json = fs.readJsonSync(this.path);
            return json.savesPath;
        } catch (e) {
            return null;
        }
    };

    Settings.prototype.setSavesPath = function (path) {
        try {
            var json = {};
            if (this.exists()) json = fs.readJsonSync(this.path);
            json.savesPath = path;
            fs.ensureDir(pathNode.dirname(this.path));
            fs.writeJsonSync(this.path, json);
            this.emit('savesPathChanged', json.savesPath);
            return json.savesPath;
        } catch (e) {
            return null;
        }
    };

    Settings.prototype.getState = function () {
        try {
            var json = fs.readJsonSync(this.path);
            return json.state;
        } catch (e) {
            return null;
        }
    };

    Settings.prototype.setState = function (state) {
        try {
            var json = {};
            if (this.exists()) json = fs.readJsonSync(this.path);
            json.state = state;
            fs.ensureDir(pathNode.dirname(this.path));
            fs.writeJsonSync(this.path, json);
            return json.state;
        } catch (e) {
            return null;
        }
    };
}

module.exports = Settings;