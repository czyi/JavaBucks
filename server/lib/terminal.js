export default {

	EOT: /\$\u001b\[\d{2}m/,

	_password: '',

	passwd (password) {
		this._password = password
	},
	sudo (inst) {
		return '(echo "' + this._password + '" | sudo -S ' + inst + ')'
	},
	runuser (user, inst) {
		return this.sudo('-u ' + user + ' ' + inst)
	},
	unformatted (text) {
		return text.replace(/\u001b\]0;.+\$\u001b\[\d{2}m/, '').trim()
	},
	colorful (text) {
		let html = text
			.replace(/\u001b\[37;40m/g, '')
			.replace(/\u001b\[37m\u001b\[40m/g, '')
			.replace(/\u001b\[30;43m/g, '<span class="terminal-highlight">')
			.replace(/\u001b\[7m/g, '<span class="terminal-whiteboard">')
			.replace(/\u001b\[31m\u001b\[40m/g, '<span class="terminal-red">')
			.replace(/\u001b\[1m\u001b\[31m/g, '<span class="terminal-red">')
			.replace(/\u001b\[31m/g, '<span class="terminal-red">')
			.replace(/\u001b\[1m\u001b\[32m/g, '<span class="terminal-green">')
			.replace(/\u001b\[1m\u001b\[33m/g, '<span class="terminal-yellow">')
			.replace(/\u001b\[34;40m/g, '<span class="terminal-blue">')
			.replace(/\u001b\[1m/g, '') // '<span class="terminal-white">'
			.replace(/\u001b\[35m/g, '<span class="terminal-magenta">')
			.replace(/\u001b\[36m/g, '<span class="terminal-cyan">')
			.replace(/\u001b\[90m/g, '<span class="terminal-grey">')
			.replace(/\u001b\[39m/g, '</span>')
			.replace(/\u001b\[22m/g, '</span>')
			.replace(/\u001b\[27m/g, '</span>')
			.replace(/\u001b\[0m/g, '</span>')
			.replace(/\u001b\[\?25[lh]/g, '') // for npm install
			.replace(/\u001b\[K/g, '') // for npm install
		let span = html.match(/<span>/g),
			end = html.match(/<\/span>/g)
		if (span && (!end || span.length > end.length)) html += '</span>'
		return html
	},
	end (text) {
		return text.slice(-7).match(this.EOT)
	}
}
