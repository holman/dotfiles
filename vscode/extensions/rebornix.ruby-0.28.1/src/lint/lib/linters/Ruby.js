"use strict";
const EOL = require("os")
	.EOL;

function RubyWC(opts) {
	this.responsePath = "stderr";
	this.title = "ruby";
	this.exe = "ruby";
	this.ext = "";
	this.path = opts.path;
	this.args = ["-wc"];

	if (opts.rubyInterpreterPath) {
		this.exe = opts.rubyInterpreterPath;
	}

	if(opts.unicode) {
		this.args.push("-Ku");
	}
}

RubyWC.prototype.processResult = function(data) {
	let messageLines = [];
	let multiLine = [];
	data.split(EOL)
		.forEach(line => {
			if (!line.length) return;
			let m = /^\-:(\d+): (?:(\w+): )?(.*)$/.exec(line);
			if (!m) {
				let marker = /^\s*\^$/.test(line);
				if (marker) {
					let p = 0,
						start = 0;
					while (multiLine.length && p < line.length) {
						start = p;
						p = multiLine.shift();
					}
					if (start < line.length) {
						let l = messageLines[messageLines.length - 1];
						l.location.column = start + 1;
						l.location.length = line.length - start;
					}
					return;
				}
				let re = /.*?[^\\]\;/g;
				let p = re.exec(line);
				multiLine = [];
				while (p) {
					multiLine.push(p.index + p[0].length);
					p = re.exec(line);
				}
				return;
			}
			messageLines.push({
				location: {
					line: parseInt(m[1]),
					column: 1,
					length: 10000
				},
				severity: m[2],
				message: m[3]
			});
		});
	return messageLines;
};

module.exports = RubyWC;
