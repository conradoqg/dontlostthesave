var Reflux = require('reflux');
var SettingActions = require('../actions/settingActions.js');
var remote = require('remote');

module.exports = Reflux.createStore({

    listenables: [SettingActions],

    getInitialState: function () {
        return remote.app.settings.get();
    },

    load: function() {
        this.trigger(remote.app.settings.get());
    },

    onSetDNSPath: function (path) {
        remote.app.settings.setDNSPath(path);
        this.load();
    },

    onSetSavesPath: function (path) {
        remote.app.settings.setSavesPath(path);
        this.load();
    },

    onSetState: function(newState) {
        var oldSettings = remote.app.settings.get();
        var oldState = oldSettings.state || {};
        var mergedState = $.extend({}, oldState, newState);
        remote.app.settings.setState(mergedState);
        this.trigger({
            state: mergedState
        });
    }
});
