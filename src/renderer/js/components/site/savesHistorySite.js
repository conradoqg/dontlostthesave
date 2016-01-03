var React = require('react');
var Reflux = require('reflux');
var SaveList = require('components/parts/saveList.js');
var SaveStore = require('stores/saveStore.js');
var SaveActions = require('actions/saveActions.js');
var electron = window.require('electron');

module.exports = React.createClass({

    displayName: 'SavesHistorySite',

    mixins: [Reflux.connect(SaveStore,'data')],

    componentDidMount: function() {
        SaveActions.load();
        electron.ipcRenderer.on('newSaves', this.newSavesHandler);
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
                    <h2><i className="archive icon"></i>Saves History</h2>
                    <div className="ui divider"></div>
                    {hasMessage && messageBox}
                    {hasSaves ? withSaves : withEmptySaves}
                </div>
            );
        }
    }
});
