"use strict";

function RubyLint(opts) {
	this.exe = "ruby-lint";
	this.ext = process.platform === 'win32' ? ".bat" : "";
	this.path = opts.path;
	this.responsePath = "stdout";
	this.args = ['{path}', '-p', 'json'];
	if (opts.levels) this.args = this.args.concat('-l', opts.levels.join(',')); //info,warning,error
	if (opts.classes) this.args = this.args.concat('-a', opts.classes.join(',')); //argument_amount, pedantics, shadowing_variables, undefined_methods, undefined_variables, unused_variables, useless_equality_checks
	this.settings = "ruby-lint.yml";
	this.temp = true;
}

/*
[{
	"level": "warning",
	"message": "unused local variable x",
	"line": 9,
	"column": 1,
	"file": "C:/Users/Bryan/AppData/Local/Temp/116127-4472-1g3n731",
	"filename": "116127-4472-1g3n731",
	"node": "(lvasgn :x\n  (int 5))"
}]
*/

RubyLint.prototype.processResult = function (data) {
	if (!data) return [];
	let offenses = JSON.parse(data);
	return offenses.map(offense => ({
		message: offense.message,
		severity: offense.level,
		location: {
			line: offense.line,
			column: offense.column,
			length: 0
		}
	}));
};

module.exports = RubyLint;