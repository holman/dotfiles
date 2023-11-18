import assert = require('assert');
import languageConfiguration from './languageConfiguration'

describe('wordPattern', function () {
	const wordPattern = languageConfiguration.wordPattern;

	it('should not match leading colon in symbols (#257)', function() {
		const text = ':fnord';
		const matches = text.match(wordPattern);

		assert.equal(matches[0], 'fnord');
	});

	it('should not match leading colons in constants (#257)', function() {
		const text = '::Bar';
		const matches = text.match(wordPattern);

		assert.equal(matches[0], 'Bar');
	});
});
