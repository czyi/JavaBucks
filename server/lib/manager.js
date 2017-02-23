export default class SSHSocketManager {

	constructor() {
		this.socket = null
		this.stream = null
		this.handlers = { all: [] }
		this.stat = ''
		this.store = {
			buffer: ''
		}
	}

	// from socket
	from(socket) {
		this.socket = socket
		return this
	}
	recv(type, handler, format) {
		if (typeof type == 'string') {
			this.socket.on(type, handler)
		} else if (typeof type == 'object') {
			Object.keys(type).forEach(key => this.recv(key, type[key]))
		}
		return this
	}
	reply(type, data) {
		let text = (typeof data == 'string') ? data : JSON.stringify(data)
		this.socket.emit(type, text)
		return this
	}
	broadcast(type, data) {
		let text = (typeof data == 'string') ? data : JSON.stringify(data)
		this.socket.broadcast.emit(type, text)
		// send a copy to self
		this.socket.emit(type, text)
		return this
	} 

	// to stream
	to(stream) {
		this.stream = stream
		let self = this
		stream.on('data', function(data) {
			data = data.toString();
			let handlers
			if (!self.stat || !self.handlers[self.stat]) {
				handlers = self.handlers['all']
			} else {
				handlers = [].concat(self.handlers['all'], self.handlers[self.stat])
			}
			handlers.forEach(func => func(data))
		})
		return this
	}
	checkout(stat) {
		if (stat == 'all') stat = ''
		this.stat = stat
		return this
	}
	invoke(...insts) {
		if (!this.stream) return this
		this.stream.write(insts.join(' && ') + '\n')
		return this
	}
	exit() {
		this.stream && this.stream.end('exit\n')
		return this
	}
	handle(type, handler) {
		if (typeof type == 'string') {
			if (!this.handlers[type]) this.handlers[type] = [];
			this.handlers[type].push(handler)
		} else if (typeof type == 'object') {
			Object.keys(type).forEach(key => this.handle(key, type[key]))
		}
		return this
	}

	// tool methods (may not return self)
	load(key){
		return this.store[key]
	}
	save(key, value) {
		this.store[key] = value
		return this
	}
	buffer(data) {
		if (data) this.store.buffer += data
		return this.store.buffer
	}
	clear(data) {
		this.store.buffer = ''
		return this
	}
}

