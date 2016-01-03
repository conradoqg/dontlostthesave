var path = require('path');
var forkPromise = require('fork-promise');

function job(done) {
    var glob = require('glob');
    glob('C://Program Files (x86)//Steam//**/219740/**/remote', done);
}

module.exports = function () {
    return forkPromise
        .fn(job)
        .then(function(files) {
            if (files.length == 0) {
                throw new Error('Don\'t Starve saves directory not found, sorry!');
            } else if (files.length > 1) {
                throw new Error('Found more than one saves directory, I can\'t decide which one is correct, sorry!');
            }
            return path.normalize(files[0]);

        });
};