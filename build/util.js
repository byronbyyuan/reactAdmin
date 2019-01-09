const os = require('os')
const path = require('path')
const HappyPack = require('happypack') //并行处理
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

//目录辅助函数
const resolve = function (dir) {
    return path.join(__dirname, '..', dir)
}

const devHost = 'localhost',
      devPort = 8888;

// 前端接口头部,鉴权登录等接口地址 按环境匹配
const config = {
    //开发环境
    dev: {
        uploadPixfile:'http://mycode.free.idcfengye.com',
        host: devHost,
        port: devPort,
        baseUrl: '/api', //请求地址前缀
        getStaffUrl: '/getStaff', //是否登录
        getStaffRolesUrl: '/getStaffRoles', //是获取权限
        logonUrl: `http://${devHost}:${devPort}/logon?url=` //登陆页面
    },
    //测试环境
    test: {
        baseUrl: '/api', //请求地址前缀
        getStaffUrl: '/getStaff', //是否登录
        getStaffRolesUrl: '/getStaffRoles', //是获取权限
        logonUrl: `http://test.poseidon.oa.com:9999/fark/logon?url=` //登陆页面
    },
    //正式环境
    production: {
        baseUrl: '/api', //请求地址前缀
        getStaffUrl: '/getStaff', //是否登录
        getStaffRolesUrl: '/getStaffRoles', //是获取权限
    }
}
//样式文件loader处理集合
const cssLoaders = function (isDev, isTest,isless=true) {
    const options = {
        sourceMap: isDev || isTest
    };
    const cssLoader = {
        loader: 'css-loader',
        options: options,
    }
    const styleLoader = {
        loader: 'style-loader',
        options: options
    }
    const postcssLoader = {
        loader: 'postcss-loader',
        options: options
    }
    const lessLoader = {
        loader: 'less-loader',
        options: options
    }
    const sassResourcesLoader = {
        loader:'sass-resources-loader',
        options:{
            resources: resolve('/src/gloab/gloab.less')
        }
    }
    if (isDev) {
        return isless ? [styleLoader, cssLoader, lessLoader, sassResourcesLoader] : [styleLoader, cssLoader, sassResourcesLoader]
    }
    return [MiniCssExtractPlugin.loader, styleLoader, cssLoader, postcssLoader, lessLoader, sassResourcesLoader]
}


const webpackRules = function (isDev, isTest) {
    return [
        {
            test: /\.(png|jpe?g|gif|svg|cur)(\?.*)?$/,
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
        },
        {
            test: /\.less$/,
            loaders: cssLoaders(isDev, isTest),
        },
        {
            test: /\.css$/,
            loaders: cssLoaders(isDev, isTest,false),
        },
        {
            test: /\.(js|jsx)$/,
            loader: ['happypack/loader?id=babel'],
            // include: [resolve('src')],
            exclude: /node_modules/
        }
    ]
}

const webpackResolve = function () {
    return {
        extensions: ['.js', '.jsx', '.json'],
        alias: {
            '@': resolve('src')
        },
        modules: [path.resolve(__dirname, '../node_modules')],
        mainFields: ["jsnext:main", 'main'],
    }
}

const happypackPlugins = function (isDev, isTest) {
    //HappyPackA
    const happyThreadPool = HappyPack.ThreadPool({
        size: os.cpus().length
    });
    const loaderArray = [
        ['babel-loader?cacheDirectory',{
            enforce: "pre",
            loader: 'eslint-loader',
            options:{
                emitWarning: isDev
            }
        }], cssLoaders(isDev, isTest)
    ];
    return ['babel', 'css'].map((item, index) => {
        return new HappyPack({
            id: item,
            threads: 4,
            threadPool: happyThreadPool,
            loaders: loaderArray[index]
        })
    });
}

module.exports = {
    appName: "demo",
    webpackResolve: webpackResolve,
    webpackRules: webpackRules,
    happypackPlugins: happypackPlugins,
    config: config,
}