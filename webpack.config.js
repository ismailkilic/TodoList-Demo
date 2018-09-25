var path = require('path');
require('webpack');

module.exports = {
    entry: './src/main/js/app.js',
    devtool: 'source-maps',
    cache: false,
    mode: 'development',
    output: {
        path: __dirname,
        filename: './src/main/resources/static/built/bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        query: {
                            presets: [ "@babel/preset-react"]

                        }
                    }
                ],
            }
        ]
    }
};