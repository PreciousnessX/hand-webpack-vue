/**webpack.base.conf.js */
const path = require('path')
const HtmlWebpackPlugin = require("html-webpack-plugin")
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MinCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')


module.exports = {
    // stats:'normal',
    entry: { // 输入配置
        bundle: path.resolve(__dirname, '../src/main.js')
    },

    output: { // 输出配置
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].[hash:8].js',
        publicPath: '/'
    },

    module: { // 对 高级js语法 和 非js文件 的处理
        rules: [{ // 高级 js语法处理
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            { // 处理vue
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            { //各种文件处理
                test: /\.(png|jpg|gif|jpeg|jfif)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        // 低于这个limit就直接转成base64插入到style里，不然以name的方式命名存放
                        // 这里的单位时bit
                        limit: 8192,
                        name: 'static/images/[name].[hash:8].[ext]'
                    }
                }]
            },
            { // 字体文件处理
                test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
                use: [{
                    loader: "url-loader",
                    options: {
                        name: 'static/font/[name].[hash:8].[ext]',
                        limit:5000, // 大于5K单独打包,小于5K直接以base64储存在css中
                        publicPath: "/",
                        outputPath: "/"
                    }
                }]
            },
            { // 处理样式文件
                test: /\.(sass|scss)$/,
                use: [
                    // {    // 当配置MinCssExtractPlugin.loader后，此项就无需配置，原因看各自作用
                    //     loader: "style-loader"  // 将处理结束的css代码存储在js中，运行时嵌入`<style>`后挂载到html页面上
                    // },
                    {
                        loader: MinCssExtractPlugin.loader, // 将处理后的CSS代码提取为独立的CSS文件，可以只在生产环境中配置，但我喜欢保持开发环境与生产环境尽量一致
                    },
                    {
                        loader: "css-loader" // CSS加载器，使webpack可以识别css文件
                    },
                    {
                        loader: "postcss-loader" //承载autoprefixer功能，为css添加前缀
                    },
                    {
                        loader: "sass-loader", // 编译sass，webpack默认使用node-sass进行编译，所以需要同时安装 sass-loader 和 node-sass
                        options: { // loader 的额外参数，配置视具体 loader 而定
                            sourceMap: true, // 要安装resolve-url-loader，当此配置项启用 sourceMap 才能正确加载 Sass 里的相对路径资源，类似background: url(../image/test.png)
                        }
                    }
                ]
            },
            { // css 样式处理
                test: /\.css/,
                use: [
                    // {    // 当配置MinCssExtractPlugin.loader后，此项就无需配置，原因看各自作用
                    //     loader: "style-loader"  // 将处理结束的css代码存储在js中，运行时嵌入`<style>`后挂载到html页面上
                    // },
                    {
                        loader: MinCssExtractPlugin.loader, // 将处理后的CSS代码提取为独立的CSS文件，可以只在生产环境中配置，但我喜欢保持开发环境与生产环境尽量一致
                    },
                    {
                        loader: "css-loader" // CSS加载器，使webpack可以识别css文件
                    },
                    {
                        loader: "postcss-loader" //承载autoprefixer功能，为css添加前缀
                    },
                ]
            }
        ]
    },
    optimization: { // 一些优化配置（抽出公共代码，单独打包）
        // 官网文档  https://webpack.docschina.org/configuration/optimization/
        runtimeChunk: 'single', // webpack 运行时文件单独打包(默认名字runtime.js)
        splitChunks: { // 详细配置 https://webpack.docschina.org/plugins/split-chunks-plugin/
            chunks: 'all', // (function(chunks)|String) 哪些板块将会被打包到公共包中 'all'，'async'和'initial'  
            minSize: 30000, // 压缩之前大于30K 的文件才进行单独打包
            maxSize: 0, // 压缩之前小于 0K 不进行压缩,它的优先级 小于minSize,所以当值小于minSize的值时 maxSize的设置不会生效 
            minChunks: 1, //拆分前必须共享模块的最小块数。// 达到这个数目才进行分割
            maxAsyncRequests: 5, // 按需加载块时并行请求的最大数量将小于或等于5 ,此时将分割代码
            maxInitialRequests: 2, // 初始页面加载时并行请求的最大数量将小于或等于2 ,此时将分割代码
            automaticNameDelimiter: '~', // 被分割的代码被打成公共包的名字
            name: true, // 设置为true 名字每次打包是则会变动
            cacheGroups: {
                // cacheGroup 设置缓存组,缓存组意味着打包成的公共包文件  不会轻易变动,一般node_modules中的文件建议设置在缓存组内打包
                // 缓存组的配置 会覆盖掉父级配置(splitChunks中的一些配置)
                vendors: { // 缓存组的名字 默认和配置key相同(vendors),当然你也可以自定义 
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10 // 优先级为 -10
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true // 如果当前块包含已从主捆绑包中拆分出的模块，则将重用该模块，而不是生成新的模块。这可能会影响块的结果文件名。
                }
            }
        }
    },

    plugins: [ // 插件配置(工具,整合资源,压缩文件等)
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../index.html'),
            filename: "index.html",
            favicon: path.resolve(__dirname, './wm.jpg')
        }),
        new VueLoaderPlugin(),
        new MinCssExtractPlugin({
            filename: 'static/css/[name].[hash:8].css',
            // filename,chunkFilename 分别是什么？官网说和output的配置中的filename，chunkFilename用法一样，
            // 于是找到了这个博客： http://react-china.org/t/webpack-output-filename-output-chunkfilename/2256/2
            chunkFilename: 'static/css/[name].[hash:8].css'
        }),
        new webpack.ProvidePlugin({ // 自动加载模块，而不必到处 import 或 require 。等于说配置全局变量
            $: 'jquery',
            jQuery: 'jquery'
        })

    ],

    resolve: { // 别名配置,方便写项目时候引入
        alias: {
            // 配置别名'vue$'，不然import 'vue'时，webpack找不到
            'vue': 'vue/dist/vue.esm.js',
            // 这个为src配置别名，非必需，为方便而已
            '@': path.resolve(__dirname, '../src')
        },
        // 在import这些拓展名的文件时，可以省略拓展名
        extensions: ['*', '.js', '.json', '.vue'],
    }
}