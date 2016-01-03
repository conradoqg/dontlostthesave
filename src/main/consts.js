var osenv = require('osenv');
var path = require('path');

module.exports = {
    'dataPath': path.resolve((process.platform === 'win32' && process.env.APPDATA) || osenv.home(), 'dontlostthesave/'),
    'defaultSavesPath': path.resolve(osenv.home(), 'dontlostthesave/')
};
