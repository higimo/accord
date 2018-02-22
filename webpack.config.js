const path                    = require('path')
const ExtractTextPlugin       = require('extract-text-webpack-plugin')
const webpack                 = require('webpack')
const extractCSS              = new ExtractTextPlugin('bundle.css', {allChunks: true})
const HtmlWebpackPlugin       = require('html-webpack-plugin')

const NODE_ENV = process.env.NODE_ENV || 'prod',
	plugins    = [],
	rules      = []

console.log(NODE_ENV + ' mode.')

plugins.push(extractCSS)
plugins.push(new HtmlWebpackPlugin({
	template: './src/html/index.html',
	inject: 'body',
	title: 'Новый проект на React',
	minify: {
		html5           : true,
		useShortDoctype : true,
	},
	hash: true
}))

if (NODE_ENV === 'anal') {
	const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
	plugins.push(new BundleAnalyzerPlugin({}))
}

if (NODE_ENV === 'prod') {
	const UglifyJSPlugin     = require('uglifyjs-webpack-plugin')
	const WebpackShellPlugin = require('webpack-shell-plugin')

	plugins.push(new webpack.optimize.OccurrenceOrderPlugin())
	plugins.push(new webpack.DefinePlugin({
		'process.env': {
			NODE_ENV: JSON.stringify('production')
		}
	}))
	plugins.push(new webpack.optimize.UglifyJsPlugin({
		parallel: 4,
		sourceMap: true,
		compress: {
			sequences    : true,
			booleans     : true,
			loops        : true,
			unused       : true,
			warnings     : false,
			drop_console : true,
		}
	}))
	plugins.push(new WebpackShellPlugin({
		onBuildEnd: [
			'npm run deploy'
		]
	}))
}

rules.push({
	test    : /\.js$/,
	exclude : [
		path.resolve(__dirname, 'node_modules'),
	],
	include: [
		path.resolve(__dirname, 'src')
	],
	use     : {
		loader  : 'babel-loader',
		options : {
			presets : [
				[
					'es2015',
					{
						'modules': false
					}
				],
				'react',
			],
			plugins : [
				[
					'transform-react-statements',
					{
						keyIs: 'id'
					}
				],
				[
					'transform-object-rest-spread',
					{
						'useBuiltIns': true
					}
				],
			]
		}
	}
})

rules.push({
	test: /\.scss$/,
	loader: extractCSS.extract({
		use: [
			{
				loader: 'css-loader',
				options: {
					sourceMap: true,
					minimize: true,
					url: false,
					import: true,
				}
			},
			{
				loader: 'sass-loader',
				options: {
					sourceMap: true,
				}
			},
			{
				loader: 'postcss-loader',
				options: {
					plugins: [
						// require('postcss-color-function'),
						// require('postcss-rgba-hex'),
						// require('postcss-easing-gradients'),
						// require('autoprefixer'),
					],
				}
			},
		]
	})
})

rules.push({
	test: /\.css$/,
	loader: 'css-loader',
	options: {
		minimize: true
	}
})

module.exports = {
	devtool          : NODE_ENV === 'dev' ? 'eval' : false,
	watch            : NODE_ENV === 'dev',
	watchOptions     : {
		aggregateTimeout : 150,
	},
	entry            : {
		'bundle.js'      : './src/index.js'
	},
	output           : {
		path             : path.resolve(__dirname, 'www/'),
		filename         : 'bundle.js'
	},
	module: {
		rules,
	},
	plugins,
	devServer   : {
		contentBase        : path.join(__dirname, '/www/'),
		compress           : true,
		port               : 9000,
		historyApiFallback : true,
		proxy: {
			'/api': {
				target: 'http://test.design.ru:80/api/',
				pathRewrite: {
					'^/api' : ''
				},
				changeOrigin: true
			},
			'/upload': {
				target: 'http://test.design.ru:80/upload/',
				pathRewrite: {
					'^/upload' : ''
				},
				changeOrigin: true
			}
		},
		stats: {
			assets          : true,
			cached          : false,
			cachedAssets    : false,
			children        : false,
			chunks          : false,
			chunkModules    : false,
			chunkOrigins    : false,
			colors          : true,
			depth           : false,
			entrypoints     : true,
			env             : false,
			errors          : true,
			errorDetails    : true,
			hash            : false,
			maxModules      : 15,
			modules         : false,
			moduleTrace     : false,
			performance     : true,
			providedExports : false,
			publicPath      : true,
			reasons         : false,
			source          : false,
			timings         : true,
			usedExports     : false,
			version         : true,
			warnings        : true,
		}
	}
};
