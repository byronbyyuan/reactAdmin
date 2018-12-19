const path = require('path')

const DllPlugin = require('webpack/lib/DllPlugin');

const webpack = require('webpack')

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

//目录辅助函数
const resolve = function (dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    entry: {
        reactBarrels: ['react','react-dom','react-router-dom','redux','axios','react-redux','prop-types'],
        otherBarrels: ['css-loader/lib/css-base.js','babel-runtime/core-js/symbol.js','core-js/library/index.js','core-js/library/fn/json/stringify.js','webpack/hot/log-apply-result.js','core-js/library/fn/promise.js','sockjs-client/dist/sockjs.js','url/url.js','events/events.js','querystring-es3/index.js','querystring-es3/encode.js','html-entities/index.js','webpack-dev-server/client/index.js','webpack-dev-server/client/socket.js']		
    },
    mode: 'development',
    output: {
        filename: '[name].dll.js',
        path: path.resolve(__dirname, './dll'),
        //library 可设置库的名称 防止全局变量冲突 为_dll_vue...
        library: '_dll_[name]'
    },
    module: {
        rules: [
        {
            test: /\.(js|jsx)$/,
            loader: 'babel-loader',
            include: [resolve('/node_modules/iview/src'),resolve('/node_modules/iview/packages')]
        },                        
        {
            test: /\.css$/,
            use:[
                MiniCssExtractPlugin.loader,
                'css-loader',
                'postcss-loader'
            ]
        },
        {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: 'url-loader',
            query: {
            limit: 10000,
            name: 'img/[name].[hash:7].[ext]'
            }
        },
        {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url-loader',
            query: {
                limit: 10000,
                name: 'fonts/[name].[hash:7].[ext]'
            }
        }
        ]
    },    
    plugins: [
        //提取css
        new MiniCssExtractPlugin({
            filename: "css/[name].css",
        }),        
        //生成映射
        new DllPlugin({
            context: __dirname,
            name: '_dll_[name]',
            path: path.resolve(__dirname, './dll', '[name].manifest.json')
        })
    ]
}
