'use strict'

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
const util = require("./util")
const { VueLoaderPlugin } = require('vue-loader')
const mode = process.env.NODE_ENV
const isTest = mode === "test"

module.exports = {
  mode: 'production',
  devtool: false,
  entry: {
    app: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'js/[name]_[chunkhash].build.js',
    chunkFilename: "js/[name]_[chunkhash].min.js",
    publicPath:'/'
  },
  resolve: util.webpackResolve(),
  module: {
    rules: util.webpackRules(false, isTest)
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: false,
        extractComments: false,
        uglifyOptions: {
          compress: {
            unused: true,
            warnings: false,
            drop_debugger: true
          },
          output: {
            comments: false
          }
        }
      }),
      new OptimizeCSSPlugin({
        cssProcessorOptions: {
          autoprefixer: { disable: true },
          discardComments: {
            removeAll: true,
          },
          safe: true,
          canPrint: true
        }
      })
    ],
    splitChunks: {
      automaticNameDelimiter: '~',
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      cacheGroups: {
        vendor: {   // 抽离第三方插件
          test: /node_modules/,
          name: 'vendors',
          minSize: 30000,
          minChunks: 1,
          chunks: 'initial',
          priority: 10
        },
        commons: { //提取公共
          test: /\.js$/,
          name: 'commons',
          minSize: 30000,
          minChunks: 3,
          chunks: 'initial',
          priority: -1,
          reuseExistingChunk: true
        }
      }
    },
    runtimeChunk: 'single'
  },
  plugins: [
    new VueLoaderPlugin(),
    ...util.happypackPlugins(false, isTest),
    //清空指定文件
    new CleanWebpackPlugin(['dist/js', 'dist/css', 'dist/*.js', 'dist/*html', 'dist/*zip'], {
      root: path.join(__dirname, '../'),
      verbose: true,
      dry: false,
    }),
    //提取css
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, '../index.html'),
      inject: true,//注入
      config: JSON.stringify(util.config[mode]),
      // favicon,  
      minify: { //压缩
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      // 根据依赖自动排序
      chunksSortMode: 'dependency'
    }),
    new InlineManifestWebpackPlugin('runtime'),
    // 生成保存在构建中的模块标识符
    new webpack.HashedModuleIdsPlugin(),
    new BundleAnalyzerPlugin({ analyzerHost: 'localhost', analyzerPort: 9001, openAnalyzer: true })
  ]
}
