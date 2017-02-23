import Vue from 'vue'
import VueResource from 'vue-resource'
import VueMdl from 'vue-mdl'

import map from './components/map.vue'

Vue.use(VueResource)
Vue.use(VueMdl)
Vue.component('bmap', map)

const urlParams = obj => {
	let str = ''
	for (let key in obj) {
		if (!obj.hasOwnProperty(key)) continue
		if (str) str += '&'
		str += key.toString() + '=' + encodeURIComponent(obj[key])
	}
	return str
}

let vm = new Vue({
	el: '#main',
  	data: {
		title: 'JB',
		selected: false,
		tab: 1,
		coords: {},
		network: '',
		upload: {
			name: '',
			description: ''
		},
		bucks: []
 	},
 	mounted() {
 		this.speedtest()
 		navigator.geolocation ? navigator.geolocation.getCurrentPosition(
 			pos => {
 				this.coords = pos.coords
 				this.$refs.bmap.init(pos.coords.latitude, pos.coords.longitude)
 				this.$http.get('/api/getList', {
 					params: {
	 					lat: pos.coords.latitude,
	 					lng: pos.coords.longitude
	 				}
 				}).then(({data}) => {
 					if (data.code === 0) {
 						return this.$emit('message', {
 							message: '网络异常，请刷新重试',
							actionHandler: event => window.location.reload(),
							actionText: '刷新',
							timeout: 2000
 						})
 					}
 					this.bucks = data.data
 					Vue.nextTick(() => {
 						this.$refs.bmap.render()
 					})
 				})
 			},
 			err => this.initDefault()
 		) : this.initDefault()
 	},
	methods: {
		initDefault() {
			this.$refs.bmap.init(31.204, 121.422)
			this.$emit('message', {
				message: '无法获取您的地理位置，部分功能已禁用',
				actionHandler: event => window.location.reload(),
				actionText: '刷新',
				timeout: 2000
			})
		},
		speedtest() {
			let img = document.createElement('img'),
				start = 0, src = ''
			img.onload = () => {
				let end = new Date().valueOf()
				this.network = 20.1 * 1000 / ((end - start) * 128)
			}
			start = new Date().valueOf()
			src = './static/buck.jpg?timestamp=' + start
			img.src = src
		},
		focus(id) {
			this.tab = 1
			this.$refs.bmap.focus(id)
		},
		submit() {
 			if (!this.upload.name || !this.upload.description) {
 				this.$emit('message', { message: '请完善您的咖啡店信息' })
 			}
 			this.$http.post('/api/addNewShop', {
				name: this.upload.name,
				description: this.upload.description,
				latitude: this.coords.latitude,
				longitude: this.coords.longitude,
				network: this.network
 			}).then(({data}) => {
 				if (data.code == 1) {
 					this.$emit('message', { message: '录入成功！' })
 					this.$refs.dialog.close()
 				} else {
 					this.$emit('message', { message: '请完善您的咖啡店信息' })
 				}
 			})
		}
	}
})
