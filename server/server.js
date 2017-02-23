import koa from 'koa';
import json from 'koa-json'
import Router from 'koa-router'
import serve from 'koa-static'
import compose from 'koa-compose'
import convert from 'koa-convert'
import bodyParser from 'koa-bodyparser'
import devConfig from '../client/config/webpack.dev.config'
import {devMiddleware, hotMiddleware} from 'koa-webpack-middleware'
import webpack from 'webpack'
import path from 'path'
import {addShop, getList, getDetail} from './db'

var app = new koa();
var router = new Router()
const DEV = process.env.NODE_ENV != 'production'

const compile = webpack(devConfig)
if (DEV) {
	app.use(devMiddleware(compile, {
		noInfo: true,
		reload: true,
		publicPath: devConfig.output.publicPath,
		stats: {
			colors: true
		}
	}))

	app.use(hotMiddleware(compile, {
		log: console.log,
		path: '/dist/__webpack_hmr',
		heartbeat: 5000
	}))
}

router.prefix('/api')
router.get('/getList', function*(){
	console.log(this.query)
	let latitude = this.query.lat
	let longitude = this.query.lng
	let distance = this.query.dist || 3000
	let res = []
	this.set('content-type', 'application/json')
	if(!latitude || !longitude){
		res = {
			code: 0,
			msg: '缺少参数'
		}
		this.body = res
		return
	}
	let data = yield getList(parseFloat(latitude), parseFloat(longitude), parseInt(distance))
	res = []
	res = data.map(function(value, index){
		var network = null;
		if (value.obj.network < 4) {
			network = 'slow';
		} else if (value.obj.network > 4 && value.obj.network < 10){
			network = 'moderate';	
		} else {
			network = 'fast';	
		}
		return Object.assign({}, value.obj, {network: network});
	})

	// data.forEach(function(item){
	// 	res.push(item)
	// })

	this.body = {code: 1, data: res}
})

router.get('/getShopDetail/:id', function*(){
	let id = this.params.id
	this.set('content-type', 'application/json')
	console.log(id)
	this.body = yield getDetail(id)
})

router.post('/addNewShop', function*(){
	let latitude = parseFloat(this.request.body.latitude)
	let longitude = parseFloat(this.request.body.longitude)
	let network = parseFloat(this.request.body.network)

	this.set('content-type', 'application/json')

	if(isNaN(latitude) || isNaN(longitude) || isNaN(network)){
		res = {
			code: 0,
			msg: '参数不合法'
		}
		this.body = res
		return
	}

	var data = {
		name: this.request.body.name,
		description: this.request.body.description,
		coordinates: [longitude, latitude],
		network: network
	}
	var res = yield addShop(data)
	this.body = res['result']['ok'] == 1 ? {code: 1, data: res['ops'][0]} : {code: 0, msg: 'mongo存储失败'}
})

app.use(serve(path.resolve(__dirname ,  '../client')))

const middlewares = convert.compose([
	//favicon(__dirname + '/favicon.ico'),
	bodyParser({formLimit: '5mb'}),
	// notFound(),
	json(),
	router.routes(),
	router.allowedMethods()
])

app.use(middlewares)

app.listen('3000', () => console.log('server started 3000'))
