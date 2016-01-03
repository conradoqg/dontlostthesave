var Reflux = require('reflux');
var SaveActions = require('../actions/saveActions.js');
var Promise = require('bluebird');
var remote = require('remote');

/*
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
                world: '1',
                day: '2'
            },
            {
                character: 'asda',
                dlc: 'ROG',
                mode: 'survival',
                world: '4',
                day: '8'
            }
        ]
    },
    {
        path: 'c:\\asdasd\\asdasda\\dasdsd',
        name: 'Name',
        date: moment().toISOString(),
        formatedDate: moment().fromNow(),
        slots: [
            {
                character: 'wes',
                dlc: null,
                mode: 'survival',
                world: '1',
                day: '8'
            },
            {
                character: 'waxwell',
                dlc: 'ROG',
                mode: 'survival',
                world: '2',
                day: '13'
            },
            {
                character: 'wx78',
                dlc: 'Shipwrecked',
                mode: 'survival',
                world: '1',
                day: '100'
            }
        ]
    }
];*/

module.exports = Reflux.createStore({

    listenables: [SaveActions],

    message: null,

    init: function () {
        this.listenTo(SaveActions.load, this.fetchData);
    },

    fetchData: function () {
        Promise.resolve(remote.app.backups.getAll())
            .then(SaveActions.load.completed)
            .catch(SaveActions.load.failed);
    },

    onLoadCompleted: function (saves) {
        this.trigger({
            message: this.message,
            saves: saves
        });
        if (this.message) this.message = null;
    },

    onLoadFailed: function (error) {
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

    }
});
