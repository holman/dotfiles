const languageConfiguration = {
	indentationRules: {
		increaseIndentPattern: /^(\s*(module|class|((private|protected)\s+)?def|unless|if|else|elsif|case|when|begin|rescue|ensure|for|while|until|(?=.*?\b(do|begin|case|if|unless)\b)("(\\.|[^\\"])*"|'(\\.|[^\\'])*'|[^#"'])*(\s(do|begin|case)|[-+=&|*/~%^<>~]\s*(if|unless)))\b(?![^;]*;.*?\bend\b)|("(\\.|[^\\"])*"|'(\\.|[^\\'])*'|[^#"'])*(\((?![^\)]*\))|\{(?![^\}]*\})|\[(?![^\]]*\]))).*$/,
		decreaseIndentPattern: /^\s*([}\])](,?\s*(#|$)|\.[a-zA-Z_]\w*\b)|(end|rescue|ensure|else|elsif|when)\b)/,
	},
	wordPattern: /(-?\d+(?:\.\d+))|([A-Za-z][^-`~@#%^&()=+[{}|;:'",<>/.*\]\s\\!?]*[!?]?)/,
};

export default languageConfiguration;
