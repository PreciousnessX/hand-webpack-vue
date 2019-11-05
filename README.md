## 一，node知识补充
[__dirname](http://nodejs.cn/api/modules.html#modules_dirname):当前模块的目录名。 与 __filename 的 path.dirname() 相同。
```
console.log(__dirname);
// 打印: /Users/mjr
console.log(path.dirname(__filename));
// 打印: /Users/mjr
```
[path.resolve([...paths])](http://nodejs.cn/api/path.html#path_path_resolve_paths):path.resolve() 方法将路径或路径片段的序列解析为绝对路径。
1. 给定的路径序列从右到左进行处理，每个后续的 path 前置，直到构造出一个绝对路径。
2. 如果在处理完所有给定的 path 片段之后还未生成绝对路径，则再加上当前工作目录。
3. 生成的路径已规范化，并且除非将路径解析为根目录，否则将删除尾部斜杠。
4. 零长度的 path 片段会被忽略。
5. 如果没有传入 path 片段，则 path.resolve() 将返回当前工作目录的绝对路径。
```
path.resolve('/foo/bar', './baz');
// 返回: '/foo/bar/baz'

path.resolve('/foo/bar', '/tmp/file/');
// 返回: '/tmp/file'

path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif');
// 如果当前工作目录是 /home/myself/node，
// 则返回 '/home/myself/node/wwwroot/static_files/gif/image.gif'
```
## 二，基本配置(先搭建起一个能用的框架,后面再完善)
项目目录如下
```
.
|---config
|   |---webpack.base.conf.js
|   |---webpack.dev.conf.js
|   |---webpack.prod.conf.js
|---dist
|---src
|   |---components
|	|	|---app.vue
|	|---static
|	|	|---css
|	|	|---images
|	|	|---fonts
|	|---main.js
|---package.json		
```
新建一个文件夹,先初始化一下项目
```powershell
$ npm init -y
```
安装webpack webpack-cli 
```powershell
$ npm i webpack webpack-cli   -D
```
### 1，webpack.base.conf.js(基础配置)
下面的代码要用到 html-webpack-plugin插件(自动将打包好的js,css引入到html中)
```powershell
$ npm i html-webpack-plugin -D
```
```javascript
/**webpack.base.conf.js */
const path = require('path')
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
    entry: { // 输入配置
        bundle: path.resolve(__dirname, '../src/main.js')
    },

    output: { // 输出配置
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].[hash:8].js',
        publicPath: '/'
    },

    module: { // 对 高级js语法 和 非js文件 的处理
        rules: []
    },
    plugins: [ // 插件配置(工具,整合资源,压缩文件等)
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../index.html'),
            filename: "index.html", 
        })
    ],
}
```
### 2，webpack.dev.conf.js(开发环境配置)
下面的代码要用到webpack-merge插件(合并webpack配置)
```powershell
$ npm i webpack-merge webpack-dev-server -D
```
```javascript
/**webpack.dev.conf.js */
const merge = require('webpack-merge')
const path = require('path')
const BaseConfig = require('./webpack.base.conf.js')

module.exports = merge(BaseConfig, {
    // mode关系到代码压缩质量  https://webpack.docschina.org/guides/tree-shaking/
    mode: 'development',
    // source-map,将编译后的代码映射到原代码，便于报错后定位错误
    devtool: "inline-source-map",
    devServer: { //开发模式服务器配置
        contentBase: path.resolve(__dirname, '../dist'),
        open: true,
        overlay: true, // 编译出现错误时，将错误直接显示在页面上
        hot: true,
        port:8811,
        proxy: { // 代理地址
            "/api":"192.168.10.157:8811"
        }
    },
    plugins: []
})
```
### 3，webpack.prod.conf.js(生产环境配置)
下面的代码要用到clean-webpack-plugin插件(每次打包时先清除dist文件夹)

```powershell
$ npm i webpack-merge -D
```

```javascript
/**webpack.prod.conf.js */
const path = require('path')
const merge = require('webpack-merge')
const BaseConfig = require('./webpack.base.conf.js')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

module.exports = merge(BaseConfig, {
    mode: 'production',
    // devtool:"source-map",  // 生成环境不配置devtool 就不用生成json了
    module: { //生产环境用到的特殊的loader 
        rules: []
    },
    plugins: [
        new CleanWebpackPlugin({})
    ]
})
```
### 4，package.json中增加脚本配置

```json
/** package.json*/
+++
 "scripts": {
    "build": "webpack --config ./config/webpack.prod.conf.js",
    "dev": "webpack-dev-server --config ./config/webpack.dev.conf.js"
  },
+++
```
### 小结:
完成上面的基本配置 已经可以上手试一下了
在根目录下创建index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <div id="app">
    	点击一下弹窗
    </div>
</body>
</html>
```
在/src文件夹下创建main.js
```javascript
document.getElementById("app").onclick = function () { 
    alert("hello")
}
```
npm run build 或者 你npm run dev 试一下
## 三，引入一些基本的loader
### 1，babel-loader:用来处理高级js语法
安装babel-loader 及一些必要的插件
```powershell
$ npm install -D babel-loader @babel/core @babel/preset-env webpack
```
```javascript
/**webpack.base.conf.js */
module.exports = {
 module: { // 对 高级js语法 和 非js文件 的处理
        rules: [
        +++
        	{ // 高级 js语法处理
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
         +++
        ]
    },
}

```
我们还需要添加一个配置文件.babelrc（为 babel-preset-env 配置）在根目录下：
```json
{
    "presets": [
        ["env", {
            "targets": {
                "browsers": [">0.25%", "last 2 versions", "not ie 8", "not op_mini all"]
            }
        }]
    ]
}
```
这就是 babel-preset-env 的作用，帮助我们配置 babel。我们只需要告诉它我们要兼容的情况（目标运行环境），它就会自动把代码转换为兼容对应环境的代码。
以上代码表示我们要求代码兼容最新两个版本的浏览器，不用兼容 8(及以下)和 Opera Mini，另外市场份额超过 0.25% 的浏览器也必须支持。
只需要告诉 babel-preset-env 你想要兼容的环境，它就会自动转换
### 2，url-loader，file-loader（处理文件，图片，字体文件）
如果我们希望在页面引入图片（包括 img 的 src 和 background 的 url）。当我们基于 webpack 进行开发时，引入图片会遇到一些问题

其中一个就是引用路径的问题。拿 background 样式用 url 引入背景图来说，我们都知道，webpack 最终会将各个模块打包成一个文件，因此我们样式中的 url 路径是相对入口 html 页面的，而不是相对于原始 css 文件所在的路径的。这就会导致图片引入失败。这个问题是用 file-loader 解决的，file-loader 可以解析项目中的 url 引入（不仅限于 css），根据我们的配置，将图片拷贝到相应的路径，再根据我们的配置，修改打包后文件引用路径，使之指向正确的文件

另外，如果图片较多，会发很多 http 请求，会降低页面性能。这个问题可以通过 url-loader 解决。url-loader 会将引入的图片编码，生成 dataURl。相当于把图片数据翻译成一串字符。再把这串字符打包到文件中，最终只需要引入这个文件就能访问图片了。当然，如果图片较大，编码会消耗性能。因此 url-loader 提供了一个 limit 参数，小于 limit 字节的文件会被转为 DataURl，大于 limit 的还会使用 file-loader 进行 copy。

url-loader 和 file-loader 是什么关系呢？简答地说，url-loader 封装了 file-loader。url-loader 赖于 file-loader，即使用 url-loader 时，也要安装 file-loader
```powershell
npm i file-loader url-loader -D
```
```javascript
module.exports = {
 module: { // 对 高级js语法 和 非js文件 的处理
        rules: [
       +++
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
       +++
        ]
    },
}
```
### 3，处理vue文件
需要安装vue-loader和 vue-template-compiler
```powershell
$ npm install -D vue-loader vue-template-compiler
```
```javascript
/**webpack.base.conf.js */
+++
const VueLoaderPlugin = require('vue-loader/lib/plugin')
+++

module.exports = {
 module: { // 对 高级js语法 和 非js文件 的处理
        rules: [
        +++
        	{ // 处理vue
                test: /\.vue$/,
                loader: 'vue-loader'
            },
         +++
        ]
    },
 plugins: [ // 插件配置(工具,整合资源,压缩文件等)
	 +++
	 new VueLoaderPlugin(),
	 +++
 ]
}

```
### ４，样式处理
* sass-loader: 将 sass,scss 转为 css
* css-loader: 将 css 转为 CommonJS 规范的 js 字符串
* style-loader: 将 js 字符串转为 style node 插入到 html 中
* postcss-loader: PostCSS 是一个允许使用 JS 插件转换样式的工具，我们用 postcss 的插件就要配置它，autoprefixer 就是 postcss 项目里的一个插件
* autoprefixer: 为css样式适配不同的浏览器,添加前缀。

需要下载如下依赖
```powershell
$ npm i -D style-loader css-loader sass sass-loader node-sass fibers postcss-loader autoprefixer
```

```javascript
/**webpack.base.conf.js */

module.exports = {
 module: { // 对 高级js语法 和 非js文件 的处理
        rules: [
        +++
        	 { // 处理样式文件
                test: /\.(sass|scss)$/,
                use: [
                     {    
                         loader: "style-loader"  // 将处理结束的css代码存储在js中，运行时嵌入`<style>`后挂载到html页面上
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
                     {   
                         loader: "style-loader"  // 将处理结束的css代码存储在js中，运行时嵌入`<style>`后挂载到html页面上
                     },
                    {
                        loader: "css-loader" // CSS加载器，使webpack可以识别css文件
                    },
                    {
                        loader: "postcss-loader" //承载autoprefixer功能，为css添加前缀
                    },
                ]
            }
         +++
        ]
    },
}

```
* 配置postcss(在根目录下添加postcss.config.js)
```javascript
module.exports = { // css 兼容配置 
    plugins: [
        require('autoprefixer')({
            overrideBrowserslist: ['defaults', 'not ie < 9', 'last 2 versions', '> 1%', 'iOS 7', 'last 3 iOS versions'],
        }),
    ],
};
```
*==上面的配置,编译之后的css直接被嵌入到html的style标签中,如果你不想这样,你可以使用mini-css-extract-plugin将css单独打包成一个css文件==*
* mini-css-extract-plugin 提取css
要提取css 上面的代码需要做如下更改
 ```javascript
/**webpack.base.conf.js */
+++
const MinCssExtractPlugin = require('mini-css-extract-plugin')
+++
module.exports = {
 module: { // 对 高级js语法 和 非js文件 的处理
        rules: [
        +++
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
         +++
        ]
    },
    plugins: [ // 插件配置(工具,整合资源,压缩文件等)
      +++
        new MinCssExtractPlugin({
            filename: 'static/css/[name].[hash:8].css',
            // filename,chunkFilename 分别是什么？官网说和output的配置中的filename，chunkFilename用法一样，
            // 于是找到了这个博客： http://react-china.org/t/webpack-output-filename-output-chunkfilename/2256/2
            chunkFilename: 'static/css/[name].[hash:8].css'
        }),
      +++
    ],
}

```
### 5，然后配置下别名 resolve.extensions
```javascript	
/** webpack.base.conf.js */
modules.exports={
	+++
	 resolve: { // 别名配置,方便写项目时候引入
        alias: {
            // 配置别名'vue$'，不然import 'vue'时，webpack找不到
            'vue$': 'vue/dist/vue.esm.js',
            // 这个为src配置别名，非必需，为方便而已
            '@': path.resolve(__dirname, '../src')
        },
        // 在import这些拓展名的文件时，可以省略拓展名
        extensions: ['*', '.js', '.json', '.vue'],
    },
	+++
}
```
### *vue的打包配置基本到这里已经可以使用，来试一下*
* 安装vue
```powershell
$ npm i vue --save
```
* /src/main.js
```javascript
/** main.js */
import Vue from 'vue';
import app from './components/app.vue';

new Vue({
    render:h => h(app)
}).$mount('#app')

```
* /src/components/app.vue
```javascript
<template>
  <div class="wrapper hello">
      <p class="title">webpack-Demo <span class="iconfont icon-fangxinfei" style="color:pink;font-size:24px;" id="toalert"></span></p>
      <div id="box">
        <img src="../static/images/wm.jpg" alt="哆啦A梦">
      </div>
      <div>加一行文字</div>
      <!-- <div class="bg-box"> </div> -->
  </div>
</template>

<script>
export default {
name:'app', 
  components:{},
  props:{},
  data(){
    return {
    }
  },
  watch:{},
  computed:{},
  methods:{},
  created(){},
  mounted(){
    $("#toalert").click(function(){
      alert("jquery已经加载成功")
    })
  }
}
</script>
<style lang="scss" scoped>
@import url("../static/css/font.css");
.wrapper{
    color:#ff0000;
    text-align: center;
    .title{
      font-size: 30px;
    }
    .bg-box{
      width: 500px;
      height:300px;
      margin: 0 auto;
      background: url("../static/images/wm.jpg")
}
}
</style>
```
* 将其他图片文件,css文件,字体文件放入相应的文件夹中(可以参照github仓库代码:[点击前往gitHub仓库](https://github.com/PreciousnessX/hand-webpack-vue))
* 把项目跑起来
```powershell
$ npm run dev
```
* 项目打包
```powershell
$ npm run build
```
可以看到效果:
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191105145446486.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQyMDM5Mjgx,size_16,color_FFFFFF,t_70)
### 四，一些优化处理
#### 1，optimization，优化配置（提取公共代码，设置缓存组）
优化处理主要是抽取公共代码,打包到一个单独的js文件中,还可以配置缓存组,将一般不会改动的代码打到缓存组中,来避免一些不需要改动的代码经常被打包。
配置参数的详解在下面的代码注释中可以找到，也可以通过注释中的超链接进入到官方文档中一探究竟。
```javascript
modules.exports={
	+++
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
	+++
}
```
#### 2，HMR 模版热重载
热重载”不只是当你修改文件的时候简单重新加载页面。启用热重载后，当你修改 .vue 文件时，该组件的所有实例将在不刷新页面的情况下被替换。它甚至保持了应用程序和被替换组件的当前状态！当你调整模版或者修改样式时，这极大地提高了开发体验，以下两种方式择一即可
* 行内方式，启动的时候通过--hot选项就 ok 了
```json
"scripts": {
  +++
  "dev": "webpack-dev-server --hot  --config config/webpack.dev.conf.js"
  +++
},
```
* 或者通过配置 webpack.dev.config.js
```javascript	
/**webpack.dev.conf.js */
+++
const webpack = require('webpack')
+++
modules.exports={
	 devServer: { //开发模式服务器配置
        contentBase: path.resolve(__dirname, '../dist'),
        open: true, // 编译后直接打开浏览器
        quiet: true, // 如果使用webpack-dev-server，需要设为true，禁止显示devServer的console信息
        overlay: true, // 编译出现错误时，将错误直接显示在页面上
        +++
        hot: true,
        +++
        port:8811,
        proxy: { // 代理地址
            "/api":"192.168.10.157:8811"
        }
    },
	plugins:[
		+++
		 new webpack.HotModuleReplacementPlugin(), // 模版热替换 记得在devServer中设置 hot:true
		+++
	]
}
```
### 3，配置一些全局变量，如jquery
先把jquery安装上
```powershell
$ npm i jquery --save
```
再将jquery全局化
```javascript	
/**webpack.prod.conf.js */

modules.exports={
	
	plugins:[
		+++
		 new webpack.ProvidePlugin({ // 自动加载模块，而不必到处 import 或 require 。等于说配置全局变量
            $: 'jquery',
            jQuery: 'jquery'
        })
		+++
	]
}
```
## 五，打包终端输出信息友好化
### 1，stats控制终端输出信息
打包的时候,或者跑webpack-dev-server服务的时候,控制台会输出很多的信息,官方提供了一个stats来配置控制台的输出内容
* 我们先对生产环境打包时控制台的输出控制一下
```javascript
/** webpack.prod.conf.js */
modules.exports={
  +++
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
  +++
}
```
这时候执行 npm run build 你会发现控制台少了一些信息,看起来是不是干净一些
你可以改变上面参数的值，来研究一下这些参数控制了哪些输出内容

### 2，friendly-errors-webpack-plugin插件
friendly-errors-webpack-plugin插件可以使控制台输出的信息更加友好
安装friendly-errors-webpack-plugin 以及将要使用的一些插件
```powershell
$ npm i -D friendly-errors-webpack-plugin node-notifier
```
我们在 webpack.pord.conf.js里增加一些配置

```javascript
/** webpack.prod.conf.js */
+++
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin")
const notifier = require('node-notifier')
+++
modules.exports={
	plugins: [
        +++
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
      +++  
    ]
}
```
看一下效果:
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191105154815431.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQyMDM5Mjgx,size_16,color_FFFFFF,t_70)
接下来对开发环境控制台输出信息进行一些配置,使得它更加美观
```javascript
/**webpack.dev.conf.js */
+++
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin")
const notifier = require('node-notifier')
+++
module.exports = merge(BaseConfig, {
   
    devServer: { //开发模式服务器配置
        contentBase: path.resolve(__dirname, '../dist'),
        open: true,
        quiet: true, // 如果使用webpack-dev-server，需要设为true，禁止显示devServer的console信息
        +++
        overlay: true, // 编译出现错误时，将错误直接显示在页面上
        +++
        hot: true,
        port:8811,
        proxy: { // 代理地址
            "/api":"192.168.10.157:8811"
        }
    },
    plugins: [
        +++
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
     +++
    ]
})
```

看一下效果:
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191105155145388.png)
## 总结：
*__webpack实现一个vue前端环境搭建已经完成，这个打包是一个单页面打包配置，有兴趣可以继续探索webpack实现多页面打包__*