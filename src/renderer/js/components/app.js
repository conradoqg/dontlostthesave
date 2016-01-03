var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
var electron = window.require('electron');
var remote = require('remote');

module.exports = React.createClass({

    displayName: 'App',

    getInitialState: function() {
        return {
            watching: (remote.app.monitor.state == remote.app.monitor.STATES.watching)
        };
    },

    setWatchingHandler: function(event, isWatching) {
        this.setState({watching: isWatching});
    },

    componentDidMount: function() {
        $('.ui.dropdown').dropdown();
        $('.asterisk.icon').popup({
            inline   : false,
            hoverable: true,
            position : 'bottom left',
            delay: {
                show: 100,
                hide: 300
            }
        });

        var self = this;
        electron.ipcRenderer.on('setWatching', this.setWatchingHandler);
    },

    render: function() {
        var style = {
            cursor: 'pointer',
            position: 'initial'
        };
        return (
            <div>
                <div className="ui fluid image">
                    <div className="ui left corner label">
                        <i className={(this.state.watching ? 'asterisk icon loading' : 'asterisk icon')} data-content={(this.state.watching ? 'The saves are being watched...' : 'Nothing being watched...')}></i>
                    </div>
                    <div className="ui gray corner label">
                        <div className="ui dropdown right pointing icon">
                            <i className="caret down icon" style={style}></i>
                            <div className="menu">
                                <Link to="savesHistory" className="item link">
                                    <i className="archive icon" style={style}></i>
                                    Saves
                                </Link>
                                <Link to="settings" className="item link">
                                    <i className="setting icon" style={style}></i>
                                    Settings
                                </Link>
                            </div>
                        </div>
                    </div>
                    <img src="./images/banner.png"/>
                </div>
                <div className="ui basic segment">
                    {this.props.children}
                </div>
                <div id="modals">
                </div>
            </div>);
    }
});
