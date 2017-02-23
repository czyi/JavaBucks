var path = require('path')
var webpack = require('webpack')
var NpmInstallPlugin = require('npm-install-webpack-plugin')

var assetsPath = path.resolve(__dirname, '../dist/')


module.exports = {
	devtool: 'source-map',
	entry: {
		'main': path.resolve(__dirname, '../main.js')
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
  		new webpack.DefinePlugin({
		    'process.env': {
		     	NODE_ENV: JSON.stringify('production')
	   		 }
	   	}),	 
	    new webpack.optimize.UglifyJsPlugin({
		    compress: {
		      warnings: false
		    }
  		}),
  		new webpack.optimize.OccurenceOrderPlugin()
	]
}

