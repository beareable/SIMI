const path = require('path');
const webpack = require('webpack');
//定义了一些文件夹的路径
const ROOT_PATH = path.resolve(__dirname);
const BUILD_PATH = path.resolve(__dirname, './public/build/admin/');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader'); //获取vueloader插件
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
const HappyPack = require('happypack');
const os = require('os'); // 系统操作函数
const happyThreadPool = HappyPack.ThreadPool({size: os.cpus().length}); // 指定线程池个数
const ModuleConcatenationPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin');

module.exports = {
	entry: {
		main: path.resolve(__dirname, './src/modules/admin/main.js')
	},
	//输出的文件名 合并以后的js会命名为xxx.build.js
	output: {
		path: BUILD_PATH,
		filename: '[name].build.js',
		// 指向异步加载的路径
		publicPath :  (process.env.NODE_ENV == 'dev'?'/public':'')+"/build/admin/"
	},
	resolve: {
		// 针对 Npm 中的第三方模块优先采用 jsnext:main 中指向的 ES6 模块化语法的文件
		mainFields: ['jsnext:main', 'browser', 'main'],
		//定义引用路径别名 配置别名可以加快webpack查找模块的速度
	    alias: {  
			'vue$': 'vue/dist/vue.esm.js',
			'@': path.resolve(__dirname,'./src')
		},
	    //缩小文件搜索范围
		modules: [path.resolve(__dirname, 'node_modules')],
	    //约定省略后缀
	    extensions: ['.js', '.vue','.css', '.less', '.sass', '.json']
	},
	module: {
		noParse: function(content) { // content 从入口开始解析的模块路径
            return /no-parser/.test(content); // 返回true则忽略对no-parser.js的解析
        },
		rules: [
			{
				test: /\.vue$/,//使用正则表达式匹配以.vue结尾的文件
				loader: 'vue-loader' //使用vue-loader处理
			},
			{
				test: /\.js$/,
				//loader: 'babel-loader',
				use: 'happypack/loader?id=babel', // 缓存loader执行结果
				include: [path.resolve(__dirname,'./src')],
				exclude: /node_modules/ // 排除不要加载的文件夹
			},
			{
				// 文件匹配正则
				test:/\.css$/,
				// 加载器，从后向前倒序使用
				use:[MiniCssExtractPlugin.loader,'css-loader']
			},
			{
				test: /.scss$/,
				use: [MiniCssExtractPlugin.loader,'css-loader', 'sass-loader']
			},
			{
				test: /\.less$/,
				// 加载器，从后向前倒序使用
				use: [MiniCssExtractPlugin.loader,'css-loader','less-loader']
			},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: 'url-loader',
				options: {
				  limit: 10000, // 只转码 1M以下的图片
				  name: 'img/[name].[hash:7].[ext]' // 发布到 dist/img 目录下，名称中添加 hash 值，避免缓存
				}
			},
			{
				test:  /\.(woff|woff2|ttf|eot|otf)\??.*$/,
                loader: 'url-loader',
                options: {
                    limit: 25000,
                    name: 'fonts/[name].[hash:7].[ext]'
                }
            }
		]
	},
	optimization: {
		usedExports: true,
		concatenateModules: true,
		occurrenceOrder: true,
		splitChunks: {
			minSize: 30000,
			minChunks: 1,
			maxAsyncRequests: 5,
			maxInitialRequests: 3,
			name: false,
			chunks: "async",         // 必须三选一： "initial" | "all"(默认就是all) | "async"
			cacheGroups: {
				// 处理入口chunk
				vendor: { // 将第三方模块提取出来
					//test: /node_modules/,
					test: /vue|vue-resource|vue-router|element-ui|nprogress/,
					chunks: 'initial',
					name: 'vendor',
					minSize: 100,
					priority: 10, // 优先
					enforce: true,
					reuseExistingChunk: true   // 可设置是否重用该chunk（查看源码没有发现默认值）
				}
			}
		},
		minimizer: [
			new UglifyJsPlugin({
				cache: true,
				parallel: true,
				sourceMap: false 
		    }),
		    new OptimizeCSSAssetsPlugin({})  // use OptimizeCSSAssetsPlugin
		]
	},
};

// 开发环境
if (process.env.NODE_ENV !== 'production') {
	// 配置开发服务器
	module.exports.devServer = {
		contentBase: path.resolve(__dirname, './'),  // 定义页面文件的位置
		historyApiFallback: {
			 rewrites: [
				{ from: /./, to: '/src/html/index.html' }
			]
		},
		hot: true,
		inline:true,
		port:8090 //端口你可以自定义
    };
    //module.exports.devtool = '#cheap-module-eval-source-map';
    module.exports.plugins = [
		new VueLoaderPlugin(),
		// 开启 Scope Hoisting
		new ModuleConcatenationPlugin(),
		new MiniCssExtractPlugin({
			filename: "[name].css"
		}),
		new HappyPack({
            id: 'babel',
            loaders: ['babel-loader?cacheDirectory'],
            threadPool: happyThreadPool,
            verbose: true
        }),
		new webpack.HotModuleReplacementPlugin()
	];
}else{
	//现网配置
	module.exports.devtool = false;
	module.exports.plugins = [
		new VueLoaderPlugin(),
		// 开启 Scope Hoisting
		new ModuleConcatenationPlugin(),
		new MiniCssExtractPlugin({
			filename: "[name].css"
		}),
		new HappyPack({
            id: 'babel',
            loaders: ['babel-loader?cacheDirectory'],
            threadPool: happyThreadPool,
            verbose: true
        }),
		new WebpackParallelUglifyPlugin({
			workerCount: os.cpus().length - 1, // 开启几个子进程去并发的执行压缩，默认是当前电脑的cpu数量减1
			uglifyJS: {
			  output: {
				beautify: false, //不需要格式化
				comments: false //不保留注释
			  },
			  compress: {
				warnings: false, // 在UglifyJs删除没有用到的代码时不输出警告
				drop_console: true, // 删除所有的 `console` 语句，可以兼容ie浏览器
				collapse_vars: true, // 内嵌定义了但是只用到一次的变量
				reduce_vars: true // 提取出出现多次但是没有定义成变量去引用的静态值
			  }
			}
		}),
		//构建前先清空，防止出现垃圾文件
		new CleanWebpackPlugin(['./public/build/admin/'], {
			root: process.cwd(),
			exclude: []
		})
   ];
}