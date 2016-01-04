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

Settings.prototype.exists = function () {
    try {
        fs.readJsonSync(this.path);
        return this.getDNSPath() && this.getSavesPath();
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
        if (process.argv.indexOf('--dev') >= 0) {
            return testPaths;
        } else {
            return json;
        }
    } catch (e) {
        if (process.argv.indexOf('--dev') >= 0) {
            return testPaths;
        } else {
            return {
                dnsPath: null,
                savesPath: null
            };
        }
    }
};

Settings.prototype.getDNSPath = function () {
    try {
        var json = fs.readJsonSync(this.path);
        if (process.argv.indexOf('--dev') >= 0) {
            return testPaths.dnsPath;
        } else {
            return json.dnsPath;
        }
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
        if (process.argv.indexOf('--dev') >= 0) {
            return testPaths.savesPath;
        } else {
            return json.savesPath;
        }
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

module.exports = Settings;