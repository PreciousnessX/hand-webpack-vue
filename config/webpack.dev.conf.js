/**webpack.dev.conf.js */
const merge = require('webpack-merge')
const path = require('path')
const BaseConfig = require('./webpack.base.conf.js')
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin")
const notifier = require('node-notifier')
const webpack = require('webpack')

module.exports = merge(BaseConfig, {
    // mode关系到代码压缩质量  https://webpack.docschina.org/guides/tree-shaking/
    mode: 'development',
    // source-map,将编译后的代码映射到原代码，便于报错后定位错误
    devtool: "inline-source-map",
    devServer: { //开发模式服务器配置
        contentBase: path.resolve(__dirname, '../dist'),
        open: true,
        quiet: true, // 如果使用webpack-dev-server，需要设为true，禁止显示devServer的console信息
        overlay: true, // 编译出现错误时，将错误直接显示在页面上
        hot: true,
        port:8811,
        proxy: { // 代理地址
            "/api":"192.168.10.157:8811"
        }
    },
    plugins: [
         new webpack.HotModuleReplacementPlugin(), // 模版热替换 记得在devServer中设置 hot:true
         new FriendlyErrorsWebpackPlugin({ // 美化控制台输出的插件 https://www.npmjs.com/package/friendly-errors-webpack-plugin
             // 运行成功
             compilationSuccessInfo: {
                 messages: ['你的应用程序在这里运行：http://localhost:8811'],
                 notes: ['项目正在运行中...']
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