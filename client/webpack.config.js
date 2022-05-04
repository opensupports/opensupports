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

const config = env => {
    return {
        devtool: 'source-map',
        entry: {
          bundle: APP_DIR + '/index.js',
        },
        output: {
            path: BUILD_DIR,
            filename: '[name].js',
            publicPath: '/'
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
                                cacheDirectory: true,
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
            contentBase: BUILD_DIR,
            host: "0.0.0.0",
            compress: true,
            port: 3000,
            disableHostCheck: true,
            open: true,
            hot: true,
            historyApiFallback: true,
            proxy: {
                "/api": {
                    target: "http://opensupports-srv:80",
                    pathRewrite: { "^/api": "" },
                    secure: false,
                    changeOrigin: true,
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
                './src/config.js',
                {from: './src/assets/images', to: 'images'},
            ]),
            new BundleAnalyzerPlugin({
                analyzerMode: process.env.NODE_ENV !== 'production' ? 'server' : 'disabled'
            }),
        ],
        resolve: {
            modules: ['./src', './node_modules']
        },
        node: { fs: 'empty' },
    };
};

module.exports = config;
