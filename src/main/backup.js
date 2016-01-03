'use strict';

var path = require('path');
var moment = require('moment');
var fs = require('fs');

var extractData = function(filenamePath) {
    var zlib = require('zlib');
    var dnsParser = require('./dnsParser.js');
    var data = fs.readFileSync(filenamePath, 'utf-8');
    var buffer = new Buffer(data.substr(11), 'base64');
    buffer = buffer.slice(16);
    buffer = zlib.inflateSync(buffer);
    var bufferString = buffer.toString();
    fs.writeFileSync(filenamePath + '.dec', bufferString, 'utf-8');
    var save = dnsParser.parse(bufferString);
    return save;
};

var Backup = function (directoryPath) {
    this.directoryPath = directoryPath;
    this.date = moment(path.basename(directoryPath).split('_').join(':').split('m').join('.'), moment.ISO_8601).toISOString();
    this.extractInfo();
};

Backup.prototype.extractInfo = function () {
    var save = null;

    try {
        save = extractData(path.resolve(this.directoryPath, 'saveindex'));
    } catch(e) {

    }

    this.path = this.directoryPath;
    this.name = this.getName();
    this.slots = [];

    if (save.slots && (save.slots instanceof Array)) {
        save.slots.forEach(function (slot) {
            if (slot.character) {
                this.slots.push({
                    character: slot.character,
                    dlc: slot.dlc,
                    mode: slot.current_mode,
                    world: (slot.modes[slot.current_mode] && slot.modes[slot.current_mode].world && slot.modes[slot.current_mode].world),
                    day: (slot.modes[slot.current_mode] && slot.modes[slot.current_mode].day && slot.modes[slot.current_mode].day)
                });
            }
        }, this);
    }
};

Backup.prototype.getName = function() {
    var name = null;
    var namePath = path.resolve(this.directoryPath, 'name');
    if (fs.existsSync(namePath)) name = fs.readFileSync(namePath, 'utf-8');
    return name;
};

Backup.prototype.setName = function(name) {
    var namePath = path.resolve(this.directoryPath, 'name');
    if (fs.existsSync(namePath)) fs.writeFileSync(namePath, name, 'utf-8');
    return name;
};

module.exports = Backup;