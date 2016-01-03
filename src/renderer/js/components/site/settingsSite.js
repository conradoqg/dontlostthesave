var React = require('react');
var Reflux = require('reflux');
var History = require('react-router').History;
var Promise = require('bluebird');
var SettingStore = require('stores/settingStore.js');
var SettingActions = require('actions/settingActions.js');
var remote = require('remote');

module.exports = React.createClass({

    displayName: 'SettingsSite',

    mixins: [Reflux.connect(SettingStore,'settings'), History],

    getInitialState: function() {
        return {
            searching: false,
            warningMessage: null,
            errorMessage: null
        };
    },

    handleChangeSavesPath: function(event) {
        SettingActions.setSavesPath(event.target.value);
    },

    handleClickSearchDNSPath: function(event) {
        event.preventDefault();
        var self = this;
        var exists = remote.app.settings.exists();
        var dnsPathSearcher = remote.require('./dnsPathSearcher.js');
        this.setState({
            searching: true
        });
        var searcher = Promise.resolve(dnsPathSearcher());

        searcher
            .then(function(path) {
                SettingActions.setDNSPath(path);
                if (!self.state.settings.savesPath) SettingActions.setSavesPath(remote.app.consts.defaultSavesPath);
                setTimeout(function() {
                    if (!exists) self.history.pushState(null, '/savesHistory');
                },1000);
            }).then(function() {
                self.setState({
                    errorMessage: null,
                    warningMessage: null
                });
            }).catch(function(e){
                self.setState({
                    errorMessage: e.message
                });
            }).finally(function() {
                self.setState({
                    searching: false
                });
            });
    },

    handleClickSelectSavesPath: function(event) {
        event.preventDefault();
        var dialog = require('remote').require('dialog');
        var selectedPath = dialog.showOpenDialog({
            title: 'Select the directory to saves the saves',
            defaultPath: this.state.settings.savesPath,
            properties: ['openDirectory', 'createDirectory']
        });

        if (selectedPath) SettingActions.setSavesPath(selectedPath[0]);
    },

    render: function() {
        var exists = remote.app.settings.exists();
        var isValidDNSPath = remote.app.settings.validDNSPath();
        var isValidSavesPath = remote.app.settings.validSavesPath();
        var warningMessage = this.state.warningMessage;
        var errorMessage = this.state.errorMessage;

        if (!exists) {
            warningMessage = 'It seems that this is the first time you use the app, please click \'Search\' to automatic locate the directory of the \'Don\'t Starve\'. If the directory is found, you will be redirected to the saves history page.';
        } else {
            if (!isValidDNSPath) errorMessage = 'The \'Don\'t Starve Saves Directory\' does not exists. Please \'Search\' it again.';
            if (!isValidSavesPath) errorMessage = 'The \'Backup Directory\' does not exists. Please \'Select\' it again.';
        }

        var messageBox = (
            <div>
                <p className={(errorMessage ? 'ui error message' : 'ui warning message')}>{errorMessage || warningMessage}</p>
                <div className="ui divider"></div>
            </div>
        );

        return (
            <div>
                <h2><i className="setting icon"></i>Settings</h2>
                <div className="ui divider"></div>
                {(errorMessage || warningMessage ? messageBox : null)}
                <div className="ui form">
                    <div className="twelve field">
                        <label>Don't Starve Saves Directory</label>
                        <div className="ui action input">
                            <input type="text" readOnly value={this.state.settings.dnsPath} placeholder="Click in the search button to find the saves directory"/>
                            <div className={(this.state.searching ? 'ui cyan loading button' : 'ui cyan button' )} onClick={this.handleClickSearchDNSPath}>Search</div>
                        </div>
                    </div>
                    <div className="twelve field">
                        <label>Backup Directory</label>
                        <div className="ui action input">
                            <input type="text" value={this.state.settings.savesPath} defaultValue={remote.app.consts.defaultSavesPath} onChange={this.handleChangeSavesPath} placeholder="Where you want to save the backup?"/>
                            <div className="ui cyan button" onClick={this.handleClickSelectSavesPath}>Select</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
