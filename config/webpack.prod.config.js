const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const merge = require('webpack-merge');

const ImageminPlugin = require('imagemin-webpack-plugin').default;
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const baseWebpackConfig = require('./webpack.base.config');
const PATHS = require('./PATHS');


console.log(`生产环境当前为: ${baseWebpackConfig.ENV === 'mobile' ? '\033[0;36m移动\033[0m' : '\033[0;36m桌面\033[0m'} 端编译\n`);
module.exports = merge(baseWebpackConfig.config, {
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, '../app/dist/')
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: ExtractTextPlugin.extract(['css-loader?importLoaders=1', 'postcss-loader']),
            include: [PATHS.SRC]
        }, {
            test: /\.less$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: ['css-loader', 'less-loader', 'postcss-loader']
            }),
            include: [PATHS.SRC]
        }, {
            test: /\.styl$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: ['css-loader', 'postcss-loader', 'stylus-loader']
            }),
            include: [PATHS.SRC]
        }]
    },
    plugins: [
        new CleanWebpackPlugin(['dist'], {
            root: PATHS.ROOT,
            verbose: true,
            dry: false
        }),
        new CleanWebpackPlugin(['sprites'], {
            root: PATHS.SRC.join('assets'),
            verbose: true,
            dry: false
        }),
        new ImageminPlugin({
            pngquant: {
                quality: '75-85'
            }
        }),
        new ExtractTextPlugin('css/mian.min.css'),
        new UglifyJSPlugin({
            sourceMap: false,
            compress: {
                warnings: true
            }
        })
    ]
})
