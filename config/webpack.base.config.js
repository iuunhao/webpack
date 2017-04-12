const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const argv = require('yargs').argv;
const load = require('pug-load');

const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const level4 = require('level4');
const precss = require('precss');
const postcssSprites = require('postcss-sprites');
const sprites = postcssSprites.default;
const updateRule = require('postcss-sprites/lib/core').updateRule;
const revHash = require('rev-hash');
const spritesmith = require('spritesmith');



const sls = require('./utils');
const PATHS = require('./PATHS');
const BASE = require('../base');
const postcssFunc = require('./postcssFunc');

//环境变量
const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';

const postcssMobilePlugs = [];



// 参数判断
if (argv.env === 'mobile') {
    postcssMobilePlugs.push()
}


const config = {
    entry: Object.assign({ 'app': PATHS.SRC.join('js/app') }, BASE.vendors),
    output: {
        filename: 'js/[name].js',
        path: PATHS.DIST,
        // publicPath: PATHS.DIST,
        chunkFilename: 'js/register/[id].[chunkHash:5].js'
    },
    devtool: !isProd ? 'cheap-source-map' : '',
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            include: PATHS.SRC,
            exclude: [PATHS.NODE_MODULES, PATHS.SRC.join('lib')],
            options: {
                presets: ['es2015']
            },
        }, {
            test: /\.pug$/,
            loader: 'pug-loader?pretty=true',
            exclude: [/lib/]
        }, {
            test: /\.html$/,
            use: [
                'html-loader?minimize=false'
            ],
            include: [PATHS.SRC]
        }]
    },
    resolve: {
        modules: [PATHS.NODE_MODULES],
        extensions: [".js", ".json", ".jsx", ".css", ".less", ".sass", ".styl", ".pug"],
        alias: {
            '@js': PATHS.SRC.join('js'),
            '@css': PATHS.SRC.join('styles'),
            '@img': PATHS.SRC.join('assets'),
            '@font': PATHS.SRC.join('font'),
            '@jquery': 'jquery/dist/jquery.min.js',
            '@lib': PATHS.SRC.join('lib'),
            '@zepto': 'n-zepto/n-zepto.js',
            '@': PATHS.NODE_MODULES
        }
    },
    plugins: [
        
        new webpack.ProvidePlugin({
            $: "jquery",
        }),
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'manifest']
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: function(css) {
                    return [
                        // postcssSprites(spritesConfig),
                        postcssSprites({
                            // retina: true,
                            // verbose: true,
                            spritesmith: {
                                padding: 30
                            },
                            spritePath: PATHS.SRC.join('/assets/sprites/'),
                            stylesheetPath: PATHS.SRC.join('/styles/'),
                            basePath: '.',
                            hooks: {
                                onUpdateRule: function(rule, token, image) {
                                    var backgroundSizeX = (image.spriteWidth / image.coords.width) * 100;
                                    var backgroundSizeY = (image.spriteHeight / image.coords.height) * 100;
                                    var backgroundPositionX = (image.coords.x / (image.spriteWidth - image.coords.width)) * 100;
                                    var backgroundPositionY = (image.coords.y / (image.spriteHeight - image.coords.height)) * 100;

                                    backgroundSizeX = isNaN(backgroundSizeX) ? 0 : backgroundSizeX;
                                    backgroundSizeY = isNaN(backgroundSizeY) ? 0 : backgroundSizeY;
                                    backgroundPositionX = isNaN(backgroundPositionX) ? 0 : backgroundPositionX;
                                    backgroundPositionY = isNaN(backgroundPositionY) ? 0 : backgroundPositionY;

                                    var backgroundImage = postcss.decl({
                                        prop: 'background-image',
                                        value: 'url(' + image.spriteUrl + ')'
                                    });

                                    var backgroundSize = postcss.decl({
                                        prop: 'background-size',
                                        value: backgroundSizeX + '% ' + backgroundSizeY + '%'
                                    });

                                    var backgroundPosition = postcss.decl({
                                        prop: 'background-position',
                                        value: backgroundPositionX + '% ' + backgroundPositionY + '%'
                                    });

                                    rule.insertAfter(token, backgroundImage);
                                    rule.insertAfter(backgroundImage, backgroundPosition);
                                    rule.insertAfter(backgroundPosition, backgroundSize);
                                },
                                onSaveSpritesheet: function(opts, spritesheet) {
                                    return `${opts.spritePath}${revHash(spritesheet.image)}.${spritesheet.extension}`
                                }
                            },
                            groupBy: function(image) {
                                if (image.url.indexOf('assets/icon') === -1) {
                                    return Promise.reject(new Error('Not a icon image.'));
                                }
                                var _dirname = path.dirname(image.originalUrl),
                                    _basename = path.basename(_dirname),
                                    _filename = _basename.split('-'),
                                    outfilename = _filename[_filename.length - 1];
                                return Promise.resolve(outfilename);
                            },
                            filterBy: function(image) {
                                if (!/((icon)-?([\w]*))/.test(image.url))
                                    return Promise.reject();
                                return Promise.resolve();
                            }
                        }),
                        postcssFunc.calculatesn,
                        postcssFunc.postcssMedia,
                        level4(),
                        autoprefixer({
                            browsers: ['ie>=8', '>1% in CN']
                        }),
                        precss,
                        cssnano({
                            zindex: false,
                            autoprefixer: false,
                            core: true,
                            reduceIdents: false,
                            svgo: false
                        })
                        // ...postcssMobilePlugs
                    ];
                }
            }
        })
    ]
}

sls.template.forEach(function(page, item, arr) {
    const plugins = config.plugins;
    switch (path.extname(page)) {
        case '.html':
            var _filename = path.basename(page, '.html');
            plugins.push(new HtmlWebpackPlugin({
                title: _filename,
                filename: _filename + '.html',
                template: PATHS.SRC.join(`${_filename}.html`),
                inject: 'body',
                minify: {
                    "removeComments": true,
                },
            }));
            break;
        case '.pug':
            var _filename = path.basename(page, '.pug');
            plugins.push(new HtmlWebpackPlugin({
                title: _filename,
                filename: _filename + '.html',
                template: PATHS.SRC.join(`${_filename}.pug`),
                inject: 'body',
                minify: {
                    "removeComments": true,
                }
            }));
            break;
    }
});


module.exports = {
    config,
    ENV: argv.env
}
