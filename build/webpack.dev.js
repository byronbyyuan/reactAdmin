'use strict'
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const OpenBrowserPlugin = require('open-browser-webpack-plugin')

const CopyWebpackPlugin = require('copy-webpack-plugin')

const util = require("./util")
const mockserver = require('./mockserver');
const config = util.config.dev

//后台请求地址
const isDev = true
//导出
module.exports = {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    entry: {
        app: './src/index.js'
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].js',
        publicPath: '/'
    },
    resolve: util.webpackResolve(),
    module: {
        rules: util.webpackRules(isDev, false)
    },
    plugins: [
        ...util.happypackPlugins(isDev, false),
        new OpenBrowserPlugin({
            url: `http://${config.host}:${config.port}/`
        }),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            title: "app",
            config: JSON.stringify(util.config['dev']),
            filename: 'index.html',
            template: 'index.html',
            inject: true
        }),
        // new CopyWebpackPlugin([{
        //     from: path.join(__dirname, './dll', '/fonts'),
        //     to: path.join(__dirname, '../dist/fonts'),
        //     cache: true
        // },
        // {
        //     from: path.join(__dirname, './dll', '/img'),
        //     to: path.join(__dirname, '../dist/img'),
        //     cache: true
        // }
        // ]),
        //dll映射     
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require(path.join(__dirname, './dll', 'reactBarrels.manifest.json'))
        }),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require(path.join(__dirname, './dll', 'otherBarrels.manifest.json'))
        }),
        new AddAssetHtmlPlugin(
            [
            {
                filepath: require.resolve('./dll/reactBarrels.dll.js'),
                includeSourcemap: false
            },
            {
                filepath: require.resolve('./dll/otherBarrels.dll.js'),
                includeSourcemap: false
            },
            ]
        )
    ],
    devServer: {
        clientLogLevel: 'warning',
        historyApiFallback: true,
        before: mockserver,
        inline: true,
        hot: true,
        contentBase: false,
        compress: true,
        host: config.host,
        port: config.port,
        open: false,
        overlay: {
            warnings: false,
            errors: true
        },
        publicPath: '/',
        proxy: { //正式的接口地址
            '/api': {
                target: "http://mycode.free.idcfengye.com"
            },
        },
        watchOptions: {
            ignored: /node_modules/,
            aggregateTimeout: 500,
            poll: 200
        }
    }
}