var Reflux = require('reflux');

module.exports = Reflux.createActions({
    setDNSPath: {
        asyncResult: true
    },

    setSavesPath: {
        asyncResult: true
    },

    get: {
        asyncResult: true
    }
});
