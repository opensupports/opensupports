/* eslint-disable */
const webpack = require('webpack');
const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
// const StyleLintPlugin = require('stylelint-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const {dependencies} = require('./package.json');

const BUILD_DIR = path.join(__dirname, 'build');
const APP_DIR = path.join(__dirname, 'src');

const VENDOR_LIST = Object.keys(dependencies);

const config = env => {
    return {
        devtool: 'source-map',
        entry: {
          config: APP_DIR + '/config.js',
          bundle: APP_DIR + '/index.js',
          vendor: VENDOR_LIST,
        },
        output: {
            path: BUILD_DIR,
            filename: '[name].js',
            publicPath: '/'
        },
        module: {
            rules: [
                {
                    test :/\.js$/,
                    exclude: /node_modules/,
                    use: ['babel-loader'/*, 'eslint-loader'*/],
                },
                {
                    test: /\.css$/,
                    use: [
                        'style-loader',
                        'css-loader',
                    ],
                },
                {
                    test: /\.scss$/,
                    enforce: 'pre',
                    use: [
                        'style-loader',
                        'css-loader',
                        'sass-loader',
                        'webpack-import-glob',
                    ],
                },
                {
                    test: /\.(png|jpe?g|gif|svg|eot|woff|woff2|ttf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {},
                        }
                    ],
                },
            ],
        },
        devServer: {
            contentBase: BUILD_DIR,
            host: 'localhost',
            compress: true,
            port: 3000,
            disableHostCheck: false,
            open: true,
            hot: true,
            historyApiFallback: true,
            proxy: {
                '/api': {
                    target: 'http://localhost:8080',
                    pathRewrite: {'^/api' : ''},
                },
            },
        },
        plugins: [
            new htmlWebpackPlugin({
                template: APP_DIR + '/index.html',
                publicPath: '/'
            }),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
                'process.env.FIXTURES': env && env.FIXTURES,
            }),
            // new StyleLintPlugin({
            //     files: './src/**/*.scss',
            //     configPath: '.stylelintrc',
            //     syntax: 'scss'
            // }),
            new CopyPlugin([
                './src/.htaccess',
                {from: './src/assets/images', to: 'images'},
            ]),
            new BundleAnalyzerPlugin(),
        ],
        optimization: {
            splitChunks: {
                cacheGroups: {
                    config: {
                        chunks: 'initial',
                        name: 'config',
                        test: 'config',
                        enforce: true,
                    },
                    vendor: {
                        chunks: 'initial',
                        name: 'vendor',
                        test: 'vendor',
                        enforce: true,
                    },
                }
            },
        },
        resolve: {
            modules: ['./src', './node_modules']
        },
        node: { fs: 'empty' },
    };
};

module.exports = config;
