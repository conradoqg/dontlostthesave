var Reflux = require('reflux');
var SaveActions = require('actions/saveActions.js');
var SettingStore = require('stores/settingStore.js');
var Promise = require('bluebird');
var moment = require('moment');
var remote = require('remote');

var sampleData = [
    {
        path: 'c:\\asdasd\\asdasda\\dasd',
        name: null,
        date: moment().toISOString(),
        slots: [
            {
                character: 'wilson',
                dlc: 'Shipwrecked',
                mode: 'survival',
                day: '2'
            },
            {
                character: 'asda',
                dlc: 'ROG',
                mode: 'survival',
                day: '8'
            }
        ]
    },
    {
        path: 'c:\\asdasd\\asdasda\\dasdsd',
        name: 'Important Save',
        date: moment().subtract(4, 'minutes').toISOString(),
        formatedDate: moment().fromNow(),
        slots: [
            {
                character: 'wes',
                dlc: null,
                mode: 'survival',
                day: '8'
            },
            {
                character: 'waxwell',
                dlc: 'ROG',
                mode: 'survival',
                day: '13'
            },
            {
                character: 'wx78',
                dlc: 'Shipwrecked',
                mode: 'survival',
                day: '100'
            }
        ]
    }
];

module.exports = Reflux.createStore({

    listenables: [SaveActions],

    message: null,
    filter: remote.app.settings.get().state || {},

    init: function () {
        this.listenTo(SaveActions.load, this.fetchData);
        this.listenTo(SettingStore, this.updateFilter);
    },

    getInitialState: function () {
        if (remote.process.argv.indexOf('--sample') >= 0) {
            return {
                saves: sampleData
            };
        }
    },

    fetchData: function () {
        this.trigger();
        Promise.resolve(remote.app.backups.getFiltered(this.filter.last, this.filter.nameds))
            .then(SaveActions.load.completed)
            .catch(SaveActions.load.failed);
    },

    onLoadCompleted: function (saves) {
        if (remote.process.argv.indexOf('--sample') < 0) {
            this.trigger({
                message: this.message,
                saves: saves
            });
            if (this.message) this.message = null;
        }
    },

    onLoadFailed: function (error) {
        console.error(error.stack);
        this.message = {
            error: error.message
        };
        this.trigger({
            message: this.message
        });
    },

    onNameIt: function (name, path) {
        Promise.resolve(remote.app.backups.nameIt(name, path))
            .catch(SaveActions.load.failed)
            .then(this.fetchData);

    },

    onRestore: function (path) {
        Promise.resolve(remote.app.backups.restore(path))
            .catch(SaveActions.load.failed)
            .then(this.fetchData);

    },

    onRemove: function (path) {
        Promise.resolve(remote.app.backups.remove(path))
            .catch(SaveActions.load.failed)
            .then(this.fetchData);

    },

    updateFilter: function(setting) {
        this.filter = {
            last: (setting.state ? setting.state.last : 10),
            nameds: (setting.state ? setting.state.nameds : false)
        };
        this.fetchData();
    }
});
