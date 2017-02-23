var path = require('path')
var webpack = require('webpack')
var NpmInstallPlugin = require('npm-install-webpack-plugin')

var assetsPath = path.resolve(__dirname, '../dist/')


module.exports = {
	devtool: 'source-map',
	entry: {
		'main':[
			path.resolve(__dirname, '../../client/main.js'),
			'webpack-hot-middleware/client?path=/dist/__webpack_hmr&timeout=20000',
		]
	},
	output: {
		path: assetsPath,
		filename: 'build.js',
		publicPath: '/dist/'
	},
	resolve: {
	  alias: {
	    vue: 'vue/dist/vue.js'
	  }
	},
	module: {
	    loaders: [
	    	{
		        test: /\.js$/,
		        exclude: /(node_modules|bower_components)/,
		        loader: 'babel',
		        query: {
		            plugins: ['transform-runtime'],
		            presets: ['es2015', 'stage-0']

		        }
	        },
		    {
		        test: /\.vue$/,
		        loader: 'vue'
		    },
		    {
		        test: /\.json$/,
		        loader: 'json'
      		},
		 
		    {
		        test: /\.(png|jpg|gif)$/,
		        loader: 'url',
		        query: {
		          limit: 10000,
		          name: '[name].[ext]?[hash]'
		        }
		    }
	    ]
  	},
  	plugins: [
  		new NpmInstallPlugin({dev: true}),
  		new webpack.HotModuleReplacementPlugin(),
  		new webpack.DefinePlugin({
		    'process.env': {
		     	NODE_ENV: JSON.stringify('dev')
	   		 }
	   	})
	]
}

