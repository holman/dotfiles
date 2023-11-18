"use strict";
const EOL = require("os")
	.EOL;

function Debride(opts) {
	this.exe = "debride";
	this.ext = process.platform === 'win32' ? ".bat" : "";
	this.path = opts.path;
	this.responsePath = "stdout";
	this.args = ['{path}'];
	this.temp = true;
	if (opts.rails) this.args.unshift('-r');
}

Debride.prototype.processResult = function(data) {
	let head = "";
	let messageLines = [];
	data.split(EOL)
		.forEach(line => {
			if (line === "These methods MIGHT not be called:") return;
			if (!line.length) return (head = "");
			let m = /\s*(.*?)\s+.*:(\d+)$/.exec(line);
			if (!m) return (head = line);
			let method = (head !== "main" ? head + "::" : "") + m[1];
			messageLines.push({
				location: {
					line: parseInt(m[2]),
					column: 1,
					length: 10000
				},
				severity: 'info',
				message: `Method ${method} may not be called`
			});
		});
	return messageLines;
};

module.exports = Debride;
