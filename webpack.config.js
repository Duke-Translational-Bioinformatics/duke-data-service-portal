var webpack = require('webpack');

module.exports.getConfig = function (type) {

    var isDev = type === 'development';

    var config = {
        entry:  './app/scripts/main.js',
        output: {
            path: __dirname,
            filename: 'main.js'
        },
        debug: isDev,
        module: {
            loaders: [
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader'
                },
                {
                    test: /\.less$/,
                    loader: 'style-loader!css-loader!less-loader'
                }
            ]
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('production')
                }
            }),
            new webpack.optimize.DedupePlugin(), //dedupe similar code
            new webpack.optimize.UglifyJsPlugin(), //minify everything
            new webpack.optimize.AggressiveMergingPlugin() //merge chunks
        ]
    };

    if (isDev) {
        config.devtool = 'eval';
    }

    return config;
}