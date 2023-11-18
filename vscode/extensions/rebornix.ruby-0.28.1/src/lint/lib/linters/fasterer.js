"use strict";
const EOL = require("os")
	.EOL;

function Fasterer(opts) {
	this.exe = "fasterer";
	this.ext = require('os')
		.platform() === 'win32' ? ".bat" : "";
	this.path = opts.path;
	this.responsePath = "stdout";
	this.args = ['{path}'];
	this.temp = true;
	this.settings = ".fasterer.yml";

	if (opts.rails) this.args.unshift('-r');
}

Fasterer.prototype.processResult = function(data) {
	let messageLines = [];
	data.split(EOL)
		.forEach(line => {
			let m = /^(.*) Occurred at lines: (.*)/.exec(line);
			if (m) {
				let re = /(\d+)/g;
				let m2 = re.exec(m[2]);
				while (m2) {
					messageLines.push({
						location: {
							line: parseInt(m2[1]),
							column: 1,
							length: 10000
						},
						severity: 'info',
						message: m[1]
					});
					m2 = re.exec(m[2]);
				}
			}
		});
	return messageLines;
};

module.exports = Fasterer;
