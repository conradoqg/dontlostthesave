'use strict';

var fs = require('fs');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var Monitor = function (settings, backups) {
    this.settings = settings;
    this.backups = backups;
    this.STATES = {
        idle: 'idle',
        watching: 'watching',
        paused: 'paused'
    };
    this.state = this.STATES.idle;
    this.paused = false;
    this.watcher = null;
    settings.on('dnsPathChanged', this.restart.bind(this));
    EventEmitter.call(this);
};

util.inherits(Monitor, EventEmitter);

Monitor.prototype.start = function () {
    var self = this;
    var timeout = null;

    if (this.settings.validDNSPath()) {
        var directoryToWatch = self.settings.getDNSPath();
        this.watcher = fs.watch(directoryToWatch, function (event, filename) {
            if (timeout) clearTimeout(timeout);
            if (!self.paused) {
                timeout = setTimeout(function () {
                    if (!self.paused) {
                        self.backups.backupFrom(directoryToWatch)
                            .then(function() {
                                self.emit('newSaves');
                            });
                    }
                }, 1000);
            }
        });
        this.state = this.STATES.watching;
        self.emit('stateChanged', this.state);
    }
};

Monitor.prototype.stop = function () {
    if (this.watcher) {
        this.state = this.STATES.idle;
        this.emit('stateChanged', this.state);
        this.watcher.close();
    }
};

Monitor.prototype.pause = function () {
    if (this.watcher) {
        this.paused = true;
        this.state = this.STATES.paused;
        this.emit('stateChanged', this.state);
    }
};

Monitor.prototype.resume = function () {
    if (this.watcher) {
        this.paused = false;
        this.state = this.STATES.watching;
        this.emit('stateChanged', this.state);
    }
};

Monitor.prototype.restart = function () {
    this.stop();
    this.start();
};

module.exports = Monitor;