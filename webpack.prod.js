const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

module.exports = {
    mode: 'production',
    entry: {
        styles: ['./src/styles/style.css'],
        vote: ['./src/scripts/vote.ts'],
        delegate: ['./src/scripts/delegate.ts'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }, {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
                exclude: /node_modules/,
            },
        ],
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    }, plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            filename: 'vote.html',
            chunks: ['vote', 'styles']
        }),
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            filename: 'delegate.html',
            chunks: ['delegate', 'styles']
        }),
        new FaviconsWebpackPlugin('./assets/favicon.png'),
    ],
};

