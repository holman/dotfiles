"use strict";

function Reek(opts) {
	this.exe = "reek";
	this.ext = process.platform === 'win32' ? ".bat" : "";
	this.path = opts.path;
	this.responsePath = "stdout";
	this.errorPath = "stderr";
	this.args = ["-f", "json", "--force-exclusion"];
}

Reek.prototype.processResult = function(data) {
	if (!data) return [];
	let offenses = JSON.parse(data);
	let messageLines = [];
	offenses.forEach(offense => {
		offense.lines.forEach(line => {
			messageLines.push({
				location: {
					line: line,
					column: 1,
					length: 10000
				},
				message: offense.context + ": " + offense.message,
				cop_name: this.exe + ":" + offense.smell_type,
				severity: "info"
			});
		});
	});
	return messageLines;
};
const EOL = require("os")
	.EOL;

Reek.prototype.processError = function(data) {
	//similar to the ruby output, but we get a length
	let messageLines = [];
	data.split(EOL)
		.forEach(line => {
			if (!line.length) return;
			let m = /^STDIN:(\d+):(\d+): (?:(\w+): )?(.*)$/.exec(line);
			if (!m) {
				let marker = /^STDIN:\d+:\s*\^(\~*)\s*$/.exec(line);
				if (marker) {
					messageLines[messageLines.length - 1].location.length = (marker[1] || "")
						.length + 1;
				}
				return;
			}
			messageLines.push({
				location: {
					line: parseInt(m[1]),
					column: parseInt(m[2]),
					length: 10000
				},
				severity: m[3],
				message: m[4]
			});
		});
	return messageLines;
};

module.exports = Reek;
