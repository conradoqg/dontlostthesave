var Reflux = require('reflux');
var SettingActions = require('../actions/settingActions.js');
var remote = require('remote');

module.exports = Reflux.createStore({

    listenables: [SettingActions],

    getInitialState: function () {
        return remote.app.settings.get();
    },

    onSetDNSPath: function (path) {
        remote.app.settings.setDNSPath(path);
        this.trigger(remote.app.settings.get());
    },

    onSetSavesPath: function (path) {
        remote.app.settings.setSavesPath(path);
        this.trigger(remote.app.settings.get());
    },

    onGet: function () {
        return {
            settings: remote.app.settings.get()
        };
    }
});
