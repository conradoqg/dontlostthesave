var React = require('react');
var Reflux = require('reflux');
var SaveList = require('components/parts/saveList.js');
var SaveStore = require('stores/saveStore.js');
var SettingStore = require('stores/settingStore.js');
var SaveActions = require('actions/saveActions.js');
var SettingActions = require('actions/settingActions.js');
var electron = window.require('electron');
var remote = require('remote');

module.exports = React.createClass({

    displayName: 'SavesHistorySite',

    mixins: [Reflux.connect(SaveStore,'data'), Reflux.connect(SettingStore,'setting')],

    componentDidMount: function() {
        if (remote.process.argv.indexOf('--sample') < 0) {
            SaveActions.load();
            SettingActions.load();
        }
        electron.ipcRenderer.on('newSaves', this.newSavesHandler);
    },

    handleAllItensClick: function(event) {
        event.preventDefault();
        SettingActions.setState({
            last: null
        });
    },

    handleLastItensClick: function(event) {
        event.preventDefault();
        SettingActions.setState({
            last: 10
        });
    },

    handleBothNamedItensClick: function(event) {
        event.preventDefault();
        SettingActions.setState({
            nameds: false
        });
    },

    handleOnlyNamedItensClick: function(event) {
        event.preventDefault();
        SettingActions.setState({
            nameds: true
        });
    },

    newSavesHandler: function() {
        SaveActions.load();
    },

    render: function() {
        var hasData = this.state.data;

        if (!hasData) {
            return (<div className="ui active centered large inline loader"></div>);
        } else {
            var hasSaves = (this.state.data.saves && (this.state.data.saves.length !== 0));
            var hasMessage = this.state.data.message;

            var messageBox = this.state.data.message ? (
                <div>
                    <p className={(this.state.data.message.error ? 'ui error message' : 'ui warning message')}>{this.state.data.message.error || this.state.data.message.warning}</p>
                    <div className="ui divider"></div>
                </div>
            ) : '';

            var withSaves = (<SaveList saves={this.state.data.saves}/>);
            var withEmptySaves = (<div className="ui center aligned segment"><h3>No Saves Yet!</h3></div>);

            return (
                <div>
                    <h2><i className="archive icon"></i>Saves History
                        <div className="ui right floated divided  horizontal link list">
                            <div className={this.state.setting.state && this.state.setting.state.last ? 'item' : 'item active'}><a href="#" onClick={this.handleAllItensClick}>all</a></div>
                            <div className={this.state.setting.state && this.state.setting.state.last ? 'item active' : 'item'}><a href="#" onClick={this.handleLastItensClick}>last 10</a></div>
                        </div>
                        <div className="ui right floated divided  horizontal link list">
                            <div className="item">-</div>
                        </div>
                        <div className="ui right floated divided  horizontal link list">
                            <div className={this.state.setting.state && this.state.setting.state.nameds ? 'item' : 'item active'}><a href="#" onClick={this.handleBothNamedItensClick}>all</a></div>
                            <div className={this.state.setting.state && this.state.setting.state.nameds ? 'item active' : 'item'}><a href="#" onClick={this.handleOnlyNamedItensClick}>nameds</a></div>
                        </div>
                    </h2>
                    <div className="ui divider"></div>
                    {hasMessage && messageBox}
                    {hasSaves ? withSaves : withEmptySaves}
                </div>
            );
        }
    }
});
