var Reflux = require('reflux');

module.exports = Reflux.createActions({

    load: {
        asyncResult: true
    },

    nameIt: {
        asyncResult: true
    },

    restore: {
        asyncResult: true
    },

    remove: {
        asyncResult: true
    },

    newSaves: {
        asyncResult: true
    }
});
