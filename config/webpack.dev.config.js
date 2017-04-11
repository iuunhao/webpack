const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ip = require('ip');

const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.config');
const PATHS = require('./PATHS');

const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

console.log(`开发环境当前为: ${baseWebpackConfig.ENV === 'mobile' ? '\033[0;36m移动\033[0m' : '\033[0;36m桌面\033[0m'} 端编译\n`);
module.exports = merge(baseWebpackConfig.config, {
    devServer: {
        contentBase: PATHS.DIST,
        historyApiFallback: true,
        port: 9000,
        compress: true,
        inline: true,
        hot: true,
        host: ip.address(),
        quiet: true
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: ['style-loader', 'css-loader?importLoaders=1', 'postcss-loader'],
            include: [PATHS.SRC],
        }, {
            test: /\.less$/,
            use: ['style-loader', 'css-loader', 'less-loader', 'postcss-loader'],
            include: [PATHS.SRC],
        }, {
            test: /\.styl$/,
            use: ['style-loader', 'css-loader', 'postcss-loader', 'stylus-loader'],
            include: [PATHS.SRC],
        }, {
            test: /\.(gif|png|jpe?g|svg)$/i,
            use: [{
                loader: 'file-loader',
                options: {
                    context: PATHS.SRC,
                    name: '[path][name].[ext]',
                    publicPath: '../',
                    outputPath: '/',
                    limit: '20000'

                }
            }],
            include: [PATHS.SRC]
        }]
    },

    plugins: [
        new FriendlyErrorsWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ]
})
