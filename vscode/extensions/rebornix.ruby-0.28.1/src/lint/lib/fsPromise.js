"use strict";

let fsCB = require('fs');
let fs = {};

function wrap(name) {
	return function () {
		let args = Array.prototype.slice.call(arguments);
		return new Promise((resolve, reject) => {
			const cb = function (e) {
				if (e) return reject(e);
				if (arguments.length === 1) return resolve();
				if (arguments.length === 2) return resolve(arguments[1]);
				let response = Array.prototype.slice.call(arguments);
				response.shift(); //drop err
				resolve(response);
			};
			args.push(cb);
			fsCB[name].apply(fsCB, args);
		});
	};
}
let keys = Object.keys(fsCB);
//set everything that isn't an async function - all of the async's have a Sync equiv
keys.filter(n => !(n + "Sync" in fsCB))
	.forEach(n => fs[n] = fsCB[n]);

//wrap all functions that have a sync equiv
keys.filter(n => typeof fsCB[n] === 'function')
	.filter(n => (n + "Sync" in fsCB))
	.forEach(n => fs[n] = wrap(n));

module.exports = fs;