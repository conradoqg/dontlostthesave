'use strict';
var pkg = require('./package.json');

module.exports = {
    devtool: 'eval',
    resolve: {
        modulesDirectories: ['src/renderer/js'],
        extensions: ['', '.js']
    },
    entry: {
        'main': './src/renderer/js/main.js'
    },
    output: {
        path: 'compile/src/renderer/',
        filename: '[name].js',
        libraryTarget: 'commonjs2'
    },
    target: 'atom',
    externals: Object.keys(pkg.dependencies),
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query:
                {
                    presets: ['es2015', 'react']
                }
            },
            { test: /\.json$/, loader: 'json-loader' }
        ]
    }
};
