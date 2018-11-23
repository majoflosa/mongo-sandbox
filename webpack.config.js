const path = require('path');

module.exports = {
    entry: './app.js',
    output: {
        path: path.join(__dirname, '/js/'),
        filename: 'main.js'
    },
    mode: 'production',
    devServer: {
        publicPath: path.join(__dirname, '/js/'),
        port: 8000,
        watchContentBase: true,
        proxy: {
            '/**': {
                target: 'http://localhost:8001',
                secure: false,
                changeOrigin: true
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loaders: ['babel-loader'],
                exclude: /node_modules/,
                // query: {
                //     presets: ['es2015']
                // }
            }
        ]
    }
}