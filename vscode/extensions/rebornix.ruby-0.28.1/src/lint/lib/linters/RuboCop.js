"use strict";

function RuboCop(opts) {
	this.exe = "rubocop";
	this.ext = process.platform === 'win32' ? ".bat" : "";
	this.path = opts.path;
	this.responsePath = "stdout";

	this.args = ["-s", "{path}", "-f", "json"] ;

	if (opts.forceExclusion) this.args.push("--force-exclusion");
	if (opts.lint) this.args.push("-l");
	if (opts.only) this.args = this.args.concat("--only", opts.only.join(','));
	if (opts.except) this.args = this.args.concat("--except", opts.except.join(','));
	if (opts.rails) this.args.push('-R');
	if (opts.require) this.args = this.args.concat("-r", opts.require.join(','));
}

RuboCop.prototype.processResult = function (data) {
	if (data == '') {
		return [];
	}
	let offenses = JSON.parse(data);
	if (offenses.summary.offense_count == 0) {
		return [];
	}
	return (offenses.files || [{
		offenses: []
	}])[0].offenses;
};

module.exports = RuboCop;
