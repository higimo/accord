const path       = require('path')
const webpack    = require('webpack')
const extractCSS = new (require('extract-text-webpack-plugin'))('bundle.css', {allChunks: true})

let NODE_ENV = process.env.NODE_ENV === 'development' ? process.env.NODE_ENV : 'production',
	isAnal = process.env.NODE_ENV === 'anal'
	plugins = [],
	rules = []

console.log(NODE_ENV + ' mode.')

plugins.push(extractCSS)
plugins.push(new webpack.DefinePlugin({
	DEV_MODE: NODE_ENV !== 'production',
	'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
}))

plugins.push(new webpack.ProvidePlugin({
	'React': 'react'
}))

if (isAnal) {
	plugins.push(new (require('webpack-bundle-analyzer')).BundleAnalyzerPlugin({}))
}

if (NODE_ENV === 'production' || NODE_ENV === 'development') {
	plugins.push(new (require('html-webpack-plugin'))({
		templateParameters: {
			title: 'Аккорды, которые я играю',
			mode: JSON.stringify(NODE_ENV)
		},
		template: './src/html/index.html',
		inject: 'body',
		minify: {
			html5           : true,
			useShortDoctype : true,
		},
		hash: true
	}))
}

if (NODE_ENV === 'production') {
	plugins.push(new webpack.optimize.OccurrenceOrderPlugin())
	plugins.push(new webpack.DefinePlugin({
		'process.env': {
			NODE_ENV: JSON.stringify('production')
		}
	}))
	if (!isAnal) {
		// plugins.push(new (require('webpack-shell-plugin'))({
		// 	onBuildEnd: [
		// 		'npm run deploy'
		// 	]
		// }))
	}
}

rules.push({
	test: /\.js$/,
	exclude: [
		path.resolve(__dirname, 'node_modules'),
	],
	use: {
		loader: 'babel-loader',
		options: {
			presets: [
				'react',
				[
					'es2015',
					{
						'modules': false
					}
				],
				'stage-2',
			],
			plugins: [
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
					minimize: NODE_ENV === 'production'
				}
			},
			{
				loader: 'postcss-loader',
				options: {
					sourceMap: true,
					plugins: [
						require('autoprefixer'),
						require('postcss-easing-gradients'),
					]
				}
			},
			{
				loader: 'sass-loader',
				options: {
					sourceMap: true,
					outputStyle: (NODE_ENV === 'production' ? 'compressed' : 'expanded'),
					precision: 4,
				}
			},
		]
	})
})

module.exports = {
	mode: NODE_ENV,
	devtool: NODE_ENV === 'development' ? 'eval' : false,
	optimization: {
		namedModules: NODE_ENV === 'development',
		nodeEnv: NODE_ENV,
		minimizer: [
			new (require('uglifyjs-webpack-plugin'))({
				parallel: 4,
				sourceMap: true,
				uglifyOptions: {
					compress: {
						sequences    : true,
						booleans     : true,
						loops        : true,
						unused       : true,
						warnings     : false,
						drop_console : true,
					}
				}
			})
		],
		splitChunks: {
			chunks: 'async',
			cacheGroups: {
				vendors: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					enforce: true,
					chunks: 'all'
				},
				style: {
					test: /[\s\S]+.scss$/,
					name: 'style',
					enforce: true,
					chunks: 'all'
				},
				default: {
					minChunks: 2,
					priority: -20,
					reuseExistingChunk: true
				}
			}
		}
	},
	watchOptions: {
		aggregateTimeout : 200,
	},
	entry: {
		'bundle': './src/index.js',
	},
	output: {
		path: path.resolve(__dirname, './www/'),
		filename: '[name].js',
		publicPath: '/'
	},
	module: {
		rules,
	},
	plugins,
	devServer: {
		contentBase        : path.join(__dirname, './www/'),
		compress           : true,
		port               : 9000,
		historyApiFallback : true,
		proxy: {
			'/api': {
				target: 'http://rassvet.dev.design.ru:80/api/',
				pathRewrite: {
					'^/api' : ''
				},
				changeOrigin: true
			},
			'/upload': {
				target: 'http://rassvet.dev.design.ru:80/upload/',
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
	},
	performance: {
		hints: false
	}
}
