/**webpack.prod.conf.js */
const path = require('path')
const merge = require('webpack-merge')
const BaseConfig = require('./webpack.base.conf.js')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin")
const notifier = require('node-notifier')

module.exports = merge(BaseConfig, {
    mode: 'production',
    // devtool:"source-map",  // 生成环境不配置devtool 就不用生成json了

    // stats的值可以是 字符串,也可以是对象( "errors-only"只在发生错误时输出,"minimal"只在发生错误或有新的编译时输出,"normal"标准输出,"verbose"全部输出,"none":没有输出)
    // stats:"none", 
    stats: {  // 配置控制台的 打印信息（自己可以改变下面的值，打包看一下控制台输出的信息）更多配置见 https://www.webpackjs.com/configuration/stats/

        // 添加资源信息
        assets: true,

        // 添加构建日期和构建时间信息
        builtAt: true,

        // 添加缓存（但未构建）模块的信息
        cached: false,

        // 显示缓存的资源（将其设置为 `false` 则仅显示输出的文件）
        cachedAssets: false,

        // 添加 children 信息
        children: false,

        // 添加 chunk 信息（设置为 `false` 能允许较少的冗长输出）
        chunks: false,

        // 将构建模块信息添加到 chunk 信息(将构建的html模块添加到chunk中)
        chunkModules: true,

        // 添加 chunk 和 chunk merge 来源的信息
        chunkOrigins: true,
    },
    module: { //生产环境用到的特殊的loader 
        rules: []
    },
    plugins: [
        new CleanWebpackPlugin({}),
        new FriendlyErrorsWebpackPlugin({
            // 运行成功
            compilationSuccessInfo: {
                messages: ['编译成功'],
                // notes: ['附加信息']
            },
            //  运行错误
            onErrors: function (severity, errors) {
                // 可以收听插件转换和优先级的错误
                // 严重性可以是'错误'或'警告'
                if (severity !== 'error') {
                    return;
                }
                const error = errors[0];
                notifier.notify({
                    title: "Webpack error",
                    message: severity + ': ' + error.name,
                    subtitle: error.file || '',
                    // icon: ICON
                });
            },
            //是否每次编译之间清除控制台
            //默认为true
            clearConsole: true,
        })
    ]
})