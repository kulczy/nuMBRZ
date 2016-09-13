var path = require('path');
var webpack = require('webpack');

module.exports = {
    devServer: {
        inline: true,
        // contentBase: './app',
        port: 8080
    },
    entry: './app/App.js',
    output: {
        path: __dirname,
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['es2015', 'react']
                }
            },
            {
                test: /\.less$/,
                loader: 'style-loader!css-loader!less-loader'
            }
        ]
    }
};
