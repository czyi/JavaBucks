<template>
	<div id="jb-map"></div>
</template>

<script>
	export default {
		data() {
			return {
				map: null,
				convertor: null,
				element: null,
				markers: {},
				icons: {}
			}
		},
		props: {
			model: Array,
			selected: [Number, Boolean]
		},
		methods: {
			init(latitude, longitude) {
				let size = new BMap.Size(30, 45)
				this.icons.fast = new BMap.Icon('./static/speed_fast.png', size);
				this.icons.moderate = new BMap.Icon('./static/speed_moderate.png', size);
				this.icons.slow = new BMap.Icon('./static/speed_slow.png', size);
				this.convertor = new BMap.Convertor()
				this.map = new BMap.Map("jb-map")
				this.map.centerAndZoom(new BMap.Point(longitude, latitude), 13)
				this.map.setCurrentCity("上海")
				this.map.addControl(new BMap.NavigationControl())
				this.map.enableScrollWheelZoom(true)
				this.render()
			},
			render() {
				this.map.clearOverlays()
				let gpspoints = this.model.map(model => {
					let [longitude, latitude] = model.coordinates
					return new BMap.Point(longitude, latitude)
				})
				this.convertor.translate(gpspoints, 1, 5, data => {
					let points = data.status == 0 ? data.points : gpspoints
					points.forEach((point, index) => {
						let model = this.model[index],
							marker = new BMap.Marker(point, {icon: this.icons[model.network]})
						marker.$model = model
						marker.$point = point
						this.markers[model._id] = marker
						this.map.addOverlay(marker)
						marker.addEventListener("click", function(){
							let infoWindowContent = 
								`<div class="mdl-card buck-card">
									<div class="mdl-card__supporting-text">
										<p>${model['network']} Mbps</p>
										<p>${model['description']}</p>
									</div>
									<div class="mdl-card__title">
										<h2 class="mdl-card__title-text">${model['name']}</h2>
									</div>
								</div>`
						    this.openInfoWindow(new BMap.InfoWindow(infoWindowContent));
						});
					})
				})
			},
			focus(id) {
				let marker = this.markers[id]
				setTimeout(() => {
					this.convertor.translate([marker.$point], 1, 5, data => {
						let point = data.status == 0 ? data.points[0] : marker.$point
						this.map.centerAndZoom(point, 15)
					})
				}, 100)
			}
		}
	}
</script>
