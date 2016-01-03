'use strict';

var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs-extra'));
var path = require('path');
var moment = require('moment');
var Backup = require('./backup.js');

var Backups = function (settings) {
    this.settings = settings;
};

Backups.prototype.getAll = function () {
    var self = this;
    return Promise
        .try(function () {
            return fs.readdirAsync(self.settings.getSavesPath());
        }).then(function (files) {
            files = files.sort().reverse();
            return files.map(function (file) {
                return new Backup(path.resolve(self.settings.getSavesPath(), file));
            });
        });
};

Backups.prototype.getLast = function (n) {
    var self = this;
    return Promise
        .try(function () {
            return fs.readdirAsync(self.settings.getSavesPath());
        }).then(function (files) {
            files = files.sort().reverse();
            files = files.slice(Math.max(files.length - n, 0));
            return files.map(function (file) {
                return new Backup(path.resolve(self.settings.getSavesPath(), file));
            });
        });
};

Backups.prototype.backupFrom = function (fromDirectoryPath) {
    var destinationPath = path.resolve(this.settings.getSavesPath(), moment().toISOString().split(':').join('_').split('.').join('m'));
    return Promise
        .try(function () {
            return fs.mkdirsAsync(destinationPath);
        }).then(function () {
            return fs.copyAsync(fromDirectoryPath, destinationPath);
        });
};

Backups.prototype.restore = function (fromDirectoryPath) {
    var destination = this.settings.getDNSPath();

    return Promise
        .try(function () {
            return fs.copyAsync(fromDirectoryPath, destination);
        }).catch(function(e) {
            throw new Error('Can\'t restore the save, maybe Don\'t Starve is running?');
        }).then(function () {
            return fs.emptyDirAsync(destination);
        }).then(function () {
            return fs.copyAsync(fromDirectoryPath, destination);
        });
};

Backups.prototype.remove = function (path) {
    return Promise
        .try(function () {
            return fs.removeAsync(path);
        });
};

Backups.prototype.nameIt = function (name, dirPath) {
    var namePath = path.resolve(dirPath, 'name');
    return Promise
        .try(function () {
            return fs.writeFileAsync(namePath, name, 'utf-8');
        });
};

module.exports = Backups;