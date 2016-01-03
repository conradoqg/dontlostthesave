var React = require('react');
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router');
var remote = require('remote');

var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;

var App = require('./components/app.js');
var SettingsSite = require('./components/site/settingsSite.js');
var SavesHistorySite = require('./components/site/savesHistorySite.js');

var hasSettingsAndIsValid = function() {
    return remote.app.settings.exists() && remote.app.settings.valid();
};

var routes = (
    <Router>
        <Route path="/" component={ App } >
            <IndexRoute component={ (hasSettingsAndIsValid() ? SavesHistorySite : SettingsSite) } />
            <Route name="settings" path="/settings" component={ SettingsSite } />
            <Route name="savesHistory" path="/savesHistory" component={ SavesHistorySite } />
        </Route>
    </Router>
);

ReactDOM.render(routes, document.getElementById('app'));
