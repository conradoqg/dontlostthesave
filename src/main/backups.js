'use strict';

var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs-extra'));
var path = require('path');
var moment = require('moment');
var Backup = require('./backup.js');

var Backups = function (settings) {
    this.settings = settings;
};

Backups.prototype.getFiltered = function (last, nameds) {
    var self = this;
    return Promise
        .try(function () {
            if (self.settings.validSavesPath()) return fs.readdirAsync(self.settings.getSavesPath());
            return [];
        }).then(function (files) {
            files = files.sort().reverse();
            if (last)
                files = files.slice(0, Math.min(files.length, last));
            if (nameds)
                files = files.filter(function (value) {
                    return fs.existsSync(path.resolve(self.settings.getSavesPath(), value, 'name'));
                });
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
        }).then(function () {
            return new Backup(destinationPath);
        });
};

Backups.prototype.restore = function (fromDirectoryPath) {
    var destination = this.settings.getDNSPath();

    return Promise
        .try(function () {
            return fs.emptyDirAsync(destination);
        }).catch(function (e) {
            throw new Error('Can\'t restore the save, maybe Don\'t Starve is running?');
        }).then(function () {
            return fs.copyAsync(fromDirectoryPath, destination);
        }).then(function () {
            var namePath = path.resolve(destination, 'name');
            if (fs.existsSync(namePath)) return fs.removeAsync(namePath);
        }).then(function () {
            var parsedPath = path.resolve(destination, 'saveindex.dec');
            if (fs.existsSync(parsedPath)) return fs.removeAsync(parsedPath);
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
            if (name.trim() === '') {
                if (fs.existsSync(namePath)) fs.unlinkSync(namePath);
            } else {
                return fs.writeFileAsync(namePath, name, 'utf-8');
            }
        });
};

module.exports = Backups;