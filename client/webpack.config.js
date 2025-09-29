/* eslint-disable */
const webpack = require('webpack');
const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
// const StyleLintPlugin = require('stylelint-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const {dependencies} = require('./package.json');

const BUILD_DIR = path.join(__dirname, 'build');
const APP_DIR = path.join(__dirname, 'src');

const config = env => {
    return {
        cache: false,
        devtool: false,
        entry: {
          bundle: APP_DIR + '/index.js',
        },
        output: {
            path: BUILD_DIR,
            filename: '[name].js',
            publicPath: '/',
            hashFunction: 'md5'
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: "babel-loader",
                            options: {
                                cacheDirectory: false,
                                cacheCompression: false,
                            },
                        } /*, 'eslint-loader'*/,
                    ],
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
            contentBase: './src',
            host: "localhost",
            compress: true,
            port: 3001,
            disableHostCheck: true,
            open: true,
            hot: true,
            historyApiFallback: true,
            publicPath: '/',
            proxy: {
                "/api": {
                    target: process.env.REACT_APP_API_URL || "http://localhost:8080",
                    pathRewrite: { "^/api": "" },
                    secure: false,
                    changeOrigin: true,
                    timeout: 60000,
                    proxyTimeout: 60000,
                    logLevel: 'debug',
                    onError: function (err, req, res) {
                        console.error('Proxy error:', err);
                    },
                    onProxyReq: function (proxyReq, req, res) {
                        console.log('Proxying request:', req.method, req.url, '-> ', proxyReq.path);
                    },
                    onProxyRes: function (proxyRes, req, res) {
                        console.log('Proxy response:', proxyRes.statusCode, req.url);
                    }
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
                'process.env.REACT_APP_CLIENT_URL': JSON.stringify(process.env.REACT_APP_CLIENT_URL),
                'process.env.REACT_APP_API_URL': JSON.stringify(process.env.REACT_APP_API_URL),
                'process.env.FIXTURES': env && env.FIXTURES,
                'window.REACT_APP_API_URL': JSON.stringify(process.env.REACT_APP_API_URL || 'http://localhost:8080'),
                'window.REACT_APP_CLIENT_URL': JSON.stringify(process.env.REACT_APP_CLIENT_URL || 'http://localhost:3001')
            }),
            // new StyleLintPlugin({
            //     files: './src/**/*.scss',
            //     configPath: '.stylelintrc',
            //     syntax: 'scss'
            // }),
            new CopyPlugin([
                './src/.htaccess',
                './src/config.js',
                {from: './src/assets/images', to: 'images'},
            ]),
        ],
        resolve: {
            modules: ['./src', './node_modules']
        },
        node: { fs: 'empty' },
    };
};

module.exports = config;
