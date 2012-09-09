#!/usr/bin/php
<?php
/**
 * phptidy
 *
 * MODIFIED VERSION for Coda PHP-Plugin
 * See http://www.chipwreck.de/blog/software/coda-php/
 * 
 * See README for more information.
 *
 * PHP version >= 5.0
 *
 * @copyright 2003-2008 Magnus Rosenbaum
 * @license   GPL v2
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA.
 *
 * @version 2.9 (2009-01-07)
 * @author  Magnus Rosenbaum <phptidy@cmr.cx>
 * @package phptidy
 */


//////////////// DEFAULT CONFIGURATION ///////////////////

// You can overwrite all these settings in your configuration files.

// List of files in your project
// Wildcards for glob() may be used.
// Example: array("*.php", "inc/*.php");
$project_files = array();

// List of files you want to exclude from the project files
// Wildcards are not allowed here.
// Example: array("inc/external_lib.php");
$project_files_excludes = array();

// The automatically added author in the phpdoc file docblocks
// If left empty no new @author doctags will be added.
// Example: "Your Name <you@example.com>"
$default_author = "";

// Name of the automatically added @package doctag in the phpdoc file docblocks
// Example: "myproject"
$default_package = "";

// String used for indenting
// If you indent with spaces you can use as much spaces as you like.
// Useful values: "\t" for indenting with tabs,
//                "  " for indenting with two spaces
$indent_char = "\t";

// Control structures with the opening curly brace on a new line
// Examples: false                      always on the same line
//           true                       always on a new line
//           array(T_CLASS, T_FUNCTION) for PEAR Coding Standards
$curly_brace_newline = array(T_CLASS, T_FUNCTION); // ok

// PHP open tag
// All php open tags will be replaced by the here defined kind of open tag.
// Useful values: "<?", "<?php", "<?PHP"
$open_tag = "<?php";

// Check encoding
// If left empty the encoding will not be checked.
// See http://php.net/manual/en/ref.mbstring.html for a list of supported
// encodings.
// Examples: "ASCII", "UTF-8", "ISO-8859-1"
$encoding = "";

// Docroot-Variables
// phptidy will strip these variables and constants from the beginning of
// include and require commands to generate appropriate @see tags also for
// these files.
// Example: array('DOCROOT', '$docroot', '$GLOBALS[\'docroot\']');
$docrootvars = array();

// These are configurable via coda plugin
$replace_phptags = true;  // ok
$fix_statement_brackets = true; // ok
$fix_separation_whitespace = true; // ok
$fix_comma_space = true; // ok
$add_blank_lines = false; // ok
$replace_shell_comments = true;	// ok

// Won't use (broken)
$fix_docblock_format = false; //! ERRORS!!
$fix_docblock_space = false;	

// Won't change
$indent = true;	
$fix_token_case = true;
$fix_builtin_functions_case = true;

$add_file_docblock = false; // default author etc. needed
$add_function_docblocks = false; // default author etc. needed
$add_doctags = false; // doctags with @return @var etc.
$replace_inline_tabs = true; // tabs -> spaces	

///////////// END OF DEFAULT CONFIGURATION ////////////////

define('CONFIGFILE', "./.phptidy-config.php");
define('CACHEFILE', "./.phptidy-cache");

error_reporting(E_ALL);

if (!version_compare(phpversion(), "5.0", ">=")) {
	exit_with_error("Error: phptidy requires PHP 5 or newer.");
}

if (php_sapi_name() != "cli") {
	exit_with_error("Error: phptidy has to be run on command line with CLI SAPI");
}

// Parse cmdline
	
$line_endings = 'NA';
if (isset($argv[1]) && $argv[1] == '-l' && isset($argv[2]) && strlen($argv[2]) > 0) {
	$line_endings = $argv[2];
}

$curly_brace_newline = array(T_CLASS, T_FUNCTION);
if (isset($argv[3]) && $argv[3] == '-b' && isset($argv[4]) && strlen($argv[4]) > 0) {
	switch ($argv[4]) {
		case 'n':
			$curly_brace_newline = true; // always newline
			break;
		case 's':
			$curly_brace_newline = false; // always sameline
			break;
		case 'p':
			$curly_brace_newline = array(T_CLASS, T_FUNCTION); // pear style
			break;
	}
}
	
if (isset($argv[5]) && $argv[5] == '-a' && isset($argv[6]) && strlen($argv[6]) > 0) {
	if ($argv[6] == '1') {
		$add_blank_lines = true;
	}
	else {
		$add_blank_lines = false;
	}
}
	
if (isset($argv[7]) && $argv[7] == '-w' && isset($argv[8]) && strlen($argv[8]) > 0) {
	if ($argv[8] == '1') {
		$fix_separation_whitespace = true;
	}
	else {
		$fix_separation_whitespace = false;
	}
}

if (isset($argv[9]) && $argv[9] == '-c' && isset($argv[10]) && strlen($argv[10]) > 0) {
	if ($argv[10] == '1') {
		$fix_comma_space = true;
	}
	else {
		$fix_comma_space = false;
	}
}
	
if (isset($argv[11]) && $argv[11] == '-f' && isset($argv[12]) && strlen($argv[12]) > 0) {
	if ($argv[12] == '1') {
		$fix_statement_brackets = true;
	}
	else {
		$fix_statement_brackets = false;
	}
}

if (isset($argv[13]) && $argv[13] == '-p' && isset($argv[14]) && strlen($argv[14]) > 0) {
	if ($argv[14] == '1') {
		$replace_phptags = true;
	}
	else {
		$replace_phptags = false;
	}
}

if (isset($argv[15]) && $argv[15] == '-i' && isset($argv[16]) && strlen($argv[16]) > 0) {
	if ($argv[16] == 't') {
		$indent_char = "\t";
	}
	else { // s1, s4, ...
		$indent_length = intval(substr($argv[16], 1));
		if ($indent_length <= 0) {
			$indent_length = 4;
		}
		$indent_char = str_repeat(' ', $indent_length);
	}
}

if (isset($argv[17]) && $argv[17] == '-r' && isset($argv[18]) && strlen($argv[18]) > 0) {
	if ($argv[18] == '1') {
		$replace_shell_comments = true;
	}
	else {
		$replace_shell_comments = false;
	}
}
	
	
$command = 'source';
$verbose = false;

$source_orig_cli = '';
while ($inp = fread(STDIN,8192)) {
    $source_orig_cli .= $inp;
}

// Load config file
if ( file_exists(CONFIGFILE) ) {
	require CONFIGFILE;
} else {

}

// Find functions and includes
$functions = array();
$seetags = array();

$source = $source_orig_cli;
$functions = array_unique(array_merge($functions, get_functions($source)));
//	find_includes($seetags, $source, $file);

$md5sum = md5(serialize($functions).serialize($seetags));
if ( isset($cache['functions_seetags']) and $md5sum == $cache['functions_seetags'] ) {
	// Use cache only if functions and seetags haven't changed
	$use_cache = true;
} else {
	$use_cache = false;
	$cache['functions_seetags'] = $md5sum;
}

if ( !extension_loaded("tokenizer") ) {
	exit_with_error("Error: The 'Tokenizer' extension for PHP is missing. See http://php.net/manual/en/book.tokenizer.php for more information.");
}

$replaced = 0;

$source_orig = $source_orig_cli;

// Process source code
$source = $source_orig;

$count = 0;
do {
	$source_in = $source;
	$source = phptidy($source_in);
	++$count;
	if ($count > 3) {
		break;
	}
} while ( $source != $source_in );

if ( $count == 1 ) { // Processing has not changed content of file
}
	
// Output
switch ($line_endings) {
	case 'CRLF':
		$source = str_replace("\n", "\r\n", $source);
		break;
	case 'CR':
		$source = str_replace("\n", "\r", $source);
		break;
}

echo $source;
exit(0);

/////////////////// FUNCTIONS //////////////////////

function exit_with_error($err_text)
{
	echo "!ERROR! $err_text";
	exit(1);
}


/**
 * Display usage information
 */
function usage() {
	echo "
Usage: phptidy.php command [files|options]

Commands:
  suffix   Write output into files with suffix .phptidy.php
  replace  Replace files and backup original as .phptidybak
  diff     Show diff between old and new source
  source   Show processed source code of affected files
  files    Show files that would be processed
  tokens   Show source file tokens
  help     Display this message

Options:
  -v       Verbose messages

If no files are supplied on command line, they will be read from the config
file.

See README and source comments for more information.

";
}


/**
 * Clean up source code
 *
 * @param string  $source
 * @return string
 */
function phptidy($source) {

	// Replace non-Unix line breaks
	// http://pear.php.net/manual/en/standards.file.php
	// Windows line breaks -> Unix line breaks
	$source = str_replace("\r\n", "\n", $source);
	// Mac line breaks -> Unix line breaks
	$source = str_replace("\r", "\n", $source);

	$tokens = get_tokens($source);

	if ($GLOBALS['command']=="tokens") {
		print_tokens($tokens);
		exit;
	}

	// Simple formatting
	if ($GLOBALS['fix_token_case']) fix_token_case($tokens);
	if ($GLOBALS['fix_builtin_functions_case']) fix_builtin_functions_case($tokens);
	if ($GLOBALS['replace_inline_tabs']) replace_inline_tabs($tokens);
	if ($GLOBALS['replace_phptags']) replace_phptags($tokens);
	if ($GLOBALS['replace_shell_comments']) replace_shell_comments($tokens);
	if ($GLOBALS['fix_statement_brackets']) fix_statement_brackets($tokens);
	if ($GLOBALS['fix_separation_whitespace']) fix_separation_whitespace($tokens);
	if ($GLOBALS['fix_comma_space']) fix_comma_space($tokens);

	// PhpDocumentor
	if ($GLOBALS['add_doctags']) {
		list($usestags, $paramtags, $returntags) = collect_doctags($tokens);
		//print_r($usestags);
		//print_r($paramtags);
		//print_r($returntags);
	}
	if ($GLOBALS['add_file_docblock']) add_file_docblock($tokens);
	if ($GLOBALS['add_function_docblocks']) add_function_docblocks($tokens);
	if ($GLOBALS['add_doctags']) {
		add_doctags($tokens, $usestags, $paramtags, $returntags, $GLOBALS['seetags']);
	}
	if ($GLOBALS['fix_docblock_format']) fix_docblock_format($tokens);
	if ($GLOBALS['fix_docblock_space']) fix_docblock_space($tokens);

	if ($GLOBALS['add_blank_lines']) add_blank_lines($tokens);

	// Indenting
	if ($GLOBALS['indent']) {
		indent($tokens);
		strip_closetag_indenting($tokens);
	}

	$source = combine_tokens($tokens);

	// Strip trailing whitespace
	$source = preg_replace("/[ \t]+\n/", "\n", $source);

	if ( substr($source, -1)!="\n" ) {
		// Add one line break at the end of the file (DISABLED!)
		// http://pear.php.net/manual/en/standards.file.php
		//		$source .= "\n";
	} else {
		// Strip empty lines at the end of the file
		while ( substr($source, -2)=="\n\n" ) $source = substr($source, 0, -1);
	}

	return $source;
}


//////////////// TOKEN FUNCTIONS ///////////////////


/**
 * Returns the text part of a token
 *
 * @param mixed   $token
 * @return string
 */
function token_text($token) {
	if (is_string($token)) return $token;
	return $token[1];
}


/**
 * Prints all tokens
 *
 * @param array   $tokens
 */
function print_tokens($tokens) {
	foreach ( $tokens as $token ) {
		if (is_string($token)) {
			echo $token."\n";
		} else {
			list($id, $text) = $token;
			echo token_name($id)." ".addcslashes($text, "\0..\40!@\@\177..\377")."\n";
		}
	}
}


/**
 * Wrapper for token_get_all(), because there is new mysterious index 2 ...
 *
 * @param string  $source
 * @return array
 */
function get_tokens(&$source) {
	$tokens = token_get_all($source);
	foreach ( $tokens as &$token ) {
		if (isset($token[2])) unset($token[2]);
	}
	return $tokens;
}


/**
 * Combines the tokens to the source code
 *
 * @param array   $tokens
 * @return string
 */
function combine_tokens($tokens) {
	$out = "";
	foreach ( $tokens as $key => $token ) {
		if (is_string($token)) {
			$out .= $token;
		} else {
			$out .= $token[1];
		}
	}
	return $out;
}


/**
 * Displays a possible syntax error
 *
 * @param array   $tokens
 * @param integer $key
 * @param string  $message (optional)
 */
function possible_syntax_error($tokens, $key, $message="") {
	echo "Possible syntax error detected";
	if ($message) echo " (".$message.")";
	echo ":\n";
	echo combine_tokens(array_slice($tokens, max(0, $key-5), 10))."\n";
}


/**
 * Removes whitespace from the beginning of a token array
 *
 * @param array   $tokens
 */
function tokens_ltrim(&$tokens) {
	while (
		isset($tokens[0][0]) and
		$tokens[0][0] === T_WHITESPACE
	) {
		array_splice($tokens, 0, 1);
	}
}


/**
 * Removes whitespace from the end of a token array
 *
 * @param array   $tokens (reference)
 */
function tokens_rtrim(&$tokens) {
	while (
		isset($tokens[$k=count($tokens)-1][0]) and
		$tokens[$k][0] === T_WHITESPACE
	) {
		array_splice($tokens, -1);
	}
}


/**
 * Removes all whitespace
 *
 * @param array   $tokens (reference)
 */
function strip_whitespace(&$tokens) {
	foreach ( $tokens as $key => $token ) {
		if (
			isset($token[0]) and
			$token[0] === T_WHITESPACE
		) {
			unset($tokens[$key]);
		}
	}
	$tokens = array_values($tokens);
}


/**
 * Gets the argument of a statement
 *
 * @param array   $tokens
 * @param integer $key    Key of the token of the command for which we want the argument
 * @return array
 */
function get_argument_tokens(&$tokens, $key) {

	$tokens_arg = array();

	$round_braces_count = 0;
	$curly_braces_count = 0;

	++$key;
	while ( isset($tokens[$key]) ) {
		$token = &$tokens[$key];

		if (is_string($token)) {
			if ($token === ";") break;
		} else {
			if ($token[0] === T_CLOSE_TAG) break;
		}

		if       ($token === "(") {
			++$round_braces_count;
		} elseif ($token === ")") {
			--$round_braces_count;
		} elseif (
			$token === "{" or (
				is_array($token) and (
					$token[0] === T_CURLY_OPEN or
					$token[0] === T_DOLLAR_OPEN_CURLY_BRACES
				)
			)
		) {
			++$curly_braces_count;
		} elseif ($token === "}") {
			--$curly_braces_count;
		}

		if ( $round_braces_count < 0 or $round_braces_count < 0 ) break;

		$tokens_arg[] = $token;

		++$key;
	}

	return $tokens_arg;
}


//////////////// FORMATTING FUNCTIONS ///////////////////


/**
 * Checks for some tokens which must not be touched
 *
 * @param array   $token
 * @return boolean
 */
function token_is_taboo(&$token) {
	return (
		// Do not touch HTML content
		$token[0] === T_INLINE_HTML or
		$token[0] === T_CLOSE_TAG or
		// Do not touch the content of strings
		$token[0] === T_CONSTANT_ENCAPSED_STRING or
		$token[0] === T_ENCAPSED_AND_WHITESPACE or
		// Do not touch the content of multiline comments
		($token[0] === T_COMMENT and substr($token[1], 0, 2) === "/*")
	);
}


/**
 * Converts commands to lower case
 *
 * @param array   $tokens (reference)
 */
function fix_token_case(&$tokens) {

	static $lower_case_tokens = array(
		T_ABSTRACT,
		T_ARRAY,
		T_ARRAY_CAST,
		T_AS,
		T_BOOL_CAST,
		T_BREAK,
		T_CASE,
		T_CATCH,
		T_CLASS,
		T_CLONE,
		T_CONST,
		T_CONTINUE,
		T_DECLARE,
		T_DEFAULT,
		T_DO,
		T_DOUBLE_CAST,
		T_ECHO,
		T_ELSE,
		T_ELSEIF,
		T_EMPTY,
		T_ENDDECLARE,
		T_ENDFOR,
		T_ENDFOREACH,
		T_ENDIF,
		T_ENDSWITCH,
		T_ENDWHILE,
		T_EVAL,
		T_EXIT,
		T_EXTENDS,
		T_FINAL,
		T_FOR,
		T_FOREACH,
		T_FUNCTION,
		T_GLOBAL,
		T_IF,
		T_IMPLEMENTS,
		T_INCLUDE,
		T_INCLUDE_ONCE,
		T_INSTANCEOF,
		T_INT_CAST,
		T_INTERFACE,
		T_ISSET,
		T_LIST,
		T_LOGICAL_AND,
		T_LOGICAL_OR,
		T_LOGICAL_XOR,
		T_NEW,
		T_OBJECT_CAST,
		T_PRINT,
		T_PRIVATE,
		T_PUBLIC,
		T_PROTECTED,
		T_REQUIRE,
		T_REQUIRE_ONCE,
		T_RETURN,
		T_STATIC,
		T_STRING_CAST,
		T_SWITCH,
		T_THROW,
		T_TRY,
		T_UNSET,
		T_UNSET_CAST,
		T_VAR,
		T_WHILE
	);

	foreach ( $tokens as &$token ) {
		if (is_string($token)) continue;
		if ($token[1] === strtolower($token[1])) continue;
		if (in_array($token[0], $lower_case_tokens)) {
			$token[1] = strtolower($token[1]);
		}
	}

}


/**
 * Converts builtin functions to lower case
 *
 * @param array   $tokens (reference)
 */
function fix_builtin_functions_case(&$tokens) {

	static $defined_internal_functions = false;
	if ($defined_internal_functions === false) {
		$defined_functions = get_defined_functions();
		$defined_internal_functions = $defined_functions['internal'];
	}

	foreach ( $tokens as $key => &$token ) {

		if (
			is_string($token) or
			$token[0] !== T_STRING or
			!isset($tokens[$key+2]) or
			// Ignore object methods
			(is_array($tokens[$key-1]) and $tokens[$key-1][0] === T_OBJECT_OPERATOR)
		) continue;

		if (
			$tokens[$key+1] === "("
		) {
			$lowercase = strtolower($token[1]);
			if (
				$token[1] !== $lowercase and
				in_array($lowercase, $defined_internal_functions)
			) {
				$token[1] = $lowercase;
			}
		} elseif (
			$tokens[$key+2] === "(" and
			is_array($tokens[$key+1]) and $tokens[$key+1][0] === T_WHITESPACE
		) {
			if (
				in_array(strtolower($token[1]), $defined_internal_functions)
			) {
				$token[1] = strtolower($token[1]);
				// Remove whitespace between function name and opening round bracket
				unset($tokens[$key+1]);
			}
		}

	}

	$tokens = array_values($tokens);
}


/**
 * Replaces inline tabs with spaces
 *
 * @param array   $tokens (reference)
 */
function replace_inline_tabs(&$tokens) {

	foreach ( $tokens as &$token ) {

		if ( is_string($token) ) {
			$text =& $token;
		} else {
			if (token_is_taboo($token)) continue;
			$text =& $token[1];
		}

		// Replace one tab with one space
		$text = str_replace("\t", " ", $text);

	}

}


/**
 * Replaces PHP-Open-Tags with consistent tags
 *
 * @param array   $tokens (reference)
 */
function replace_phptags(&$tokens) {

	foreach ( $tokens as $key => &$token ) {
		if (is_string($token)) continue;

		switch ($token[0]) {
		case T_OPEN_TAG:

			// The open tag is already the right one
			if ( rtrim($token[1]) == $GLOBALS['open_tag'] ) continue;

			// Collect following whitespace
			preg_match("/\s*$/", $token[1], $matches);
			$whitespace = $matches[0];
			if ( $tokens[$key+1][0] === T_WHITESPACE ) {
				$whitespace .= $tokens[$key+1][1];
				array_splice($tokens, $key+1, 1);
			}

			if ($GLOBALS['open_tag']=="<?") {

				// Short open tags have the following whitespace in a seperate token
				array_splice($tokens, $key, 1, array(
						array(T_OPEN_TAG, $GLOBALS['open_tag']),
						array(T_WHITESPACE, $whitespace)
					));

			} else {

				// Long open tags have the following whitespace included in the token string
				switch (strlen($whitespace)) {
				case 0:
					// Add an additional space if no whitespace is found
					$whitespace = " ";
				case 1:
					// Use the one found space or newline
					$tokens[$key][1] = $GLOBALS['open_tag'].$whitespace;
					break;
				default:
					// Use the first space or newline for the open tag and append the rest of the whitespace as a seperate token
					array_splice($tokens, $key, 1, array(
							array(T_OPEN_TAG, $GLOBALS['open_tag'].substr($whitespace, 0, 1)),
							array(T_WHITESPACE, substr($whitespace, 1))
						));
				}

			}

			break;
		case T_OPEN_TAG_WITH_ECHO:

			// If we use short tags we also accept the echo tags
			if ($GLOBALS['open_tag']=="<?") continue;

			if ( $tokens[$key+1][0] === T_WHITESPACE ) {
				// If there is already whitespace following we only replace the open tag
				array_splice($tokens, $key, 1, array(
						array(T_OPEN_TAG, $GLOBALS['open_tag']." "),
						array(T_ECHO, "echo")
					));
			} else {
				// If there is no whitespace following we add one space
				array_splice($tokens, $key, 1, array(
						array(T_OPEN_TAG, $GLOBALS['open_tag']." "),
						array(T_ECHO, "echo"),
						array(T_WHITESPACE, " ")
					));
			}

		}

	}

}


/**
 * Replaces shell style comments with C style comments
 *
 * http://pear.php.net/manual/en/standards.comments.php
 *
 * @param array   $tokens (reference)
 */
function replace_shell_comments(&$tokens) {

	foreach ( $tokens as &$token ) {
		if (is_string($token)) continue;
		if (
			$token[0] === T_COMMENT and
			substr($token[1], 0, 1) === "#"
		) {
			$token[1] = "//".substr($token[1], 1);
		}
	}

}


/**
 * Enforces statements without brackets and fixes whitespace
 *
 * http://pear.php.net/manual/en/standards.including.php
 *
 * @param array   $tokens (reference)
 */
function fix_statement_brackets(&$tokens) {

	static $statement_tokens = array(
		T_INCLUDE,
		T_INCLUDE_ONCE,
		T_REQUIRE,
		T_REQUIRE_ONCE,
		T_RETURN,
		T_BREAK,
		T_CONTINUE,
		T_ECHO
	);

	foreach ( $tokens as $key => &$token ) {

		if ( is_string($token) or !in_array($token[0], $statement_tokens) ) continue;

		$tokens_arg = get_argument_tokens($tokens, $key);
		$tokens_arg_orig = $tokens_arg;

		tokens_ltrim($tokens_arg);

		if ( !count($tokens_arg) or $tokens_arg[0] !== "(" ) continue;

		tokens_rtrim($tokens_arg);

		// Check if the opening bracket has a matching one at the end of the expression
		$round_braces_count = 0;
		foreach ( $tokens_arg as $k => $t ) {
			if (is_string($t)) {
				if     ($t === "(") ++$round_braces_count;
				elseif ($t === ")") --$round_braces_count;
				else continue;
				// Check if the expression begins without a bracket or if the bracket was closed before the end of the expression was reached
				if ( $round_braces_count == 0 and $k != count($tokens_arg)-1 ) {
					continue 2;
				}
				if ( $round_braces_count < 0 ) {
					possible_syntax_error($tokens, $key, "Closing round bracket found which has not been opened");
					continue 2;
				}
			} else {
				// Do not touch multiline expressions
				if ($t[0] === T_WHITESPACE and strpos($t[1], "\n")!==false) {
					continue 2;
				}
			}
		}
		// Detect missing brackets
		if ($round_braces_count != 0) {
			possible_syntax_error($tokens, $key, "Round bracket opened but no matching closing bracket found");
			continue;
		}

		// Remove the outermost brackets
		$tokens_arg = array_slice($tokens_arg, 1, -1);

		tokens_ltrim($tokens_arg);
		tokens_rtrim($tokens_arg);

		// Add one space between the command and the argument if the argument is not empty
		if ($tokens_arg) {
			array_unshift($tokens_arg, array(T_WHITESPACE, " "));
		}

		array_splice($tokens, $key+1, count($tokens_arg_orig), $tokens_arg);

	}

}


/**
 * Fixes whitespace between commands and braces
 *
 * @param array   $tokens (reference)
 */
function fix_separation_whitespace(&$tokens) {

	$control_structure = false;

	foreach ( $tokens as $key => &$token ) {
		if (is_string($token)) {

			// Exactly 1 space or a newline between closing round bracket and opening curly bracket
			if ( $tokens[$key] === ")" ) {
				if (
					isset($tokens[$key+1]) and $tokens[$key+1] === "{"
				) {
					// Insert an additional space or newline before the bracket
					array_splice($tokens, $key+1, 0, array(
							array(T_WHITESPACE, separation_whitespace($control_structure))
						));
				} elseif (
					isset($tokens[$key+1][0]) and $tokens[$key+1][0] === T_WHITESPACE and
					isset($tokens[$key+2]) and $tokens[$key+2] === "{"
				) {
					// Set the existing whitespace before the bracket to exactly one space or newline
					$tokens[$key+1][1] = separation_whitespace($control_structure);
				}
			}

		} else {

			switch ($token[0]) {
			case T_CLASS:
				// Class definition
				if (
					isset($tokens[$key+1][0]) and $tokens[$key+1][0] === T_WHITESPACE and
					isset($tokens[$key+2][0]) and $tokens[$key+2][0] === T_STRING
				) {
					// Exactly 1 space between 'class' and the class name
					$tokens[$key+1][1] = " ";
					// Exactly 1 space between the class name and the opening curly bracket
					if ( $tokens[$key+3] === "{" ) {
						// Insert an additional space or newline before the bracket
						array_splice($tokens, $key+3, 0, array(
								array(T_WHITESPACE, separation_whitespace(T_CLASS))
							));
					} elseif (
						isset($tokens[$key+3][0]) and $tokens[$key+3][0] === T_WHITESPACE and
						isset($tokens[$key+4]) and $tokens[$key+4] === "{"
					) {
						// Set the existing whitespace before the bracket to exactly one space or a newline
						$tokens[$key+3][1] = separation_whitespace(T_CLASS);
					}
				}
				break;
			case T_FUNCTION:
				// Function definition
				if (
					isset($tokens[$key+1][0]) and $tokens[$key+1][0] === T_WHITESPACE and
					isset($tokens[$key+2][0]) and $tokens[$key+2][0] === T_STRING
				) {
					// Exactly 1 Space between 'function' and the function name
					$tokens[$key+1][1] = " ";
					// No whitespace between function name and opening round bracket
					if ( isset($tokens[$key+3][0]) and $tokens[$key+3][0] === T_WHITESPACE ) {
						// Remove the whitespace
						array_splice($tokens, $key+3, 1);
					}
				}
				break;
			case T_IF:
			case T_ELSEIF:
			case T_FOR:
			case T_FOREACH:
			case T_WHILE:
			case T_SWITCH:
				// At least 1 space between a statement and a opening round bracket
				if ( $tokens[$key+1] === "(" ) {
					// Insert an additional space or newline before the bracket
					array_splice($tokens, $key+1, 0, array(
							array(T_WHITESPACE, separation_whitespace(T_SWITCH)),
						));
				}
				break;
			case T_ELSE:
			case T_DO:
				// Exactly 1 space between a command and a opening curly bracket
				if ( $tokens[$key+1] === "{" ) {
					// Insert an additional space or newline before the bracket
					array_splice($tokens, $key+1, 0, array(
							array(T_WHITESPACE, separation_whitespace(T_DO)),
						));
				} elseif (
					isset($tokens[$key+1][0]) and $tokens[$key+1][0] === T_WHITESPACE and
					isset($tokens[$key+2]) and $tokens[$key+2] === "{"
				) {
					// Set the existing whitespace before the bracket to exactly one space or a newline
					$tokens[$key+1][1] = separation_whitespace(T_DO);
				}
				break;
			default:
				// Do not set $control_structure if the token is no control structure
				continue 2;
			}

			$control_structure = $token[0];

		}

	}

}


/**
 * Whitespace before an opening curly bracket depending on the control structure
 *
 * @param integer $control_structure token of the control structure
 * @return string
 */
function separation_whitespace($control_structure) {
	if (
		$GLOBALS['curly_brace_newline']===true or (
			is_array($GLOBALS['curly_brace_newline']) and
			in_array($control_structure, $GLOBALS['curly_brace_newline'])
		)
	) return "\n";
	return " ";
}


/**
 * Adds one space after a comma
 *
 * @param array   $tokens (reference)
 */
function fix_comma_space(&$tokens) {

	foreach ( $tokens as $key => &$token ) {
		if (!is_string($token)) continue;
		if (
			// If the current token ends with a comma...
			substr($token, -1) === "," and
			// ...and the next token is no whitespace
			!(isset($tokens[$key+1][0]) and $tokens[$key+1][0] === T_WHITESPACE)
		) {
			// Insert one space
			array_splice($tokens, $key+1, 0, array(
					array(T_WHITESPACE, " ")
				));
		}
	}

}


/**
 * Fixes the format of a DocBlock
 *
 * @param array   $tokens (reference)
 */
function fix_docblock_format(&$tokens) {

	foreach ( $tokens as $key => &$token ) {

		if ( is_string($token) or $token[0] !== T_DOC_COMMENT ) continue;

		$lines_orig = explode("\n", $tokens[$key][1]);

		$lines = array();
		$comments_started = false;
		$doctags_started = false;
		$last_line = false;
		$param_max_variable_length = 0;
		foreach ( $lines_orig as $line ) {
			$line = trim($line);
			// Strip empty lines
			if ($line=="") continue;
			if ($line!="/**" and $line!="*/") {

				// Add stars where missing
				if (substr($line, 0, 1)!="*") $line = "* ".$line;
				elseif ($line!="*" and substr($line, 0, 2)!="* ") $line = "* ".substr($line, 1);

				// Strip empty lines at the beginning
				if (!$comments_started) {
					if ($line=="*" and count($lines_orig)>3) continue;
					$comments_started = true;
				}

				if (substr($line, 0, 3)=="* @") {

					// Add empty line before DocTags if missing
					if (!$doctags_started) {
						if ($last_line!="*") $lines[] = "*";
						if ($last_line=="/**") $lines[] = "*";
						$doctags_started = true;
					}

					// DocTag format
					if ( preg_match('/^\* @param(\s+[^\s\$]*)?\s+(&?\$[^\s]+)/', $line, $matches) ) {
						$param_max_variable_length = max($param_max_variable_length, strlen($matches[2]));
					}

				}

			}
			$lines[] = $line;
			$last_line = $line;
		}

		foreach ( $lines as $l => $line ) {

			// DocTag format
			if ( preg_match('/^\* @param(\s+([^\s\$]*))?(\s+(&?\$[^\s]+))?(.*)$/', $line, $matches) ) {
				$line = "* @param ";
				if ($matches[2]) $line .= str_pad($matches[2], 7); else $line .= "unknown";
				$line .= " ";
				if ($matches[4]) $line .= str_pad($matches[4], $param_max_variable_length)." ";
				$line .= trim($matches[5]);
				$lines[$l] = $line;
			}

		}

		$token[1] = join("\n", $lines);

	}

}


/**
 * Adjusts empty lines after DocBlocks
 *
 * @param array   $tokens (reference)
 */
function fix_docblock_space(&$tokens) {

	$filedocblock = true;

	foreach ( $tokens as $key => &$token ) {

		if ( is_string($token) or $token[0] !== T_DOC_COMMENT ) continue;

		if ( $filedocblock ) {

			// Exactly 2 empty lines after the file DocBlock
			if ( $tokens[$key+1][0] === T_WHITESPACE ) {
				$tokens[$key+1][1] = preg_replace("/\n([ \t]*\n)*/", "\n\n\n", $tokens[$key+1][1]);
			}
			$filedocblock = false;

		} else {

			// Delete empty lines after the DocBlock
			if ( $tokens[$key+1][0] === T_WHITESPACE ) {
				$tokens[$key+1][1] = preg_replace("/\n([ \t]*\n)+/", "\n", $tokens[$key+1][1]);
			}

			// Add empty lines before the DocBlock
			if ( $tokens[$key-1][0] === T_WHITESPACE ) {
				$n = 2;
				if ( substr(token_text($tokens[$key-2]), -1) == "\n" ) --$n;
				// At least 2 empty lines before the docblock of a function
				if ( $tokens[$key+2][0] === T_FUNCTION ) ++$n;
				if ( strpos($tokens[$key-1][1], str_repeat("\n", $n)) === false ) {
					$tokens[$key-1][1] = preg_replace("/(\n){1,".$n."}/", str_repeat("\n", $n), $tokens[$key-1][1]);
				}
			}

		}

	}

}


/**
 * Adds 2 blank lines after functions and classes
 *
 * @param array   $tokens (reference)
 */
function add_blank_lines(&$tokens) {

	// Level of curly brackets
	$curly_braces_count = 0;

	$curly_brace_opener = array();
	$control_structure = false;

	$heredoc_started = false;

	foreach ($tokens as $key => &$token) {

		// Skip HEREDOC
		if ( $heredoc_started ) {
			if ( isset($token[0]) and $token[0] === T_END_HEREDOC ) {
				$heredoc_started = false;
			}
			continue;
		}

		if (is_array($token)) {

			// Detect beginning of a HEREDOC block
			if ( $token[0] === T_START_HEREDOC ) {
				$heredoc_started = true;
				continue;
			}

			// Remember the type of control structure
			if ( in_array($token[0], array(T_IF, T_ELSEIF, T_WHILE, T_FOR, T_FOREACH, T_SWITCH, T_FUNCTION, T_CLASS)) ) {
				$control_structure = $token[0];
				continue;
			}

		}

		if ($token === "}") {

			if (
				$curly_brace_opener[$curly_braces_count] === T_FUNCTION or
				$curly_brace_opener[$curly_braces_count] === T_CLASS
			) {

				// At least 2 blank lines after a function or class
				if (
					$tokens[$key+1][0] === T_WHITESPACE and
					substr($tokens[$key+1][1], 0, 2) != "\n\n\n"
				) {
					$tokens[$key+1][1] = preg_replace("/^([ \t]*\n){1,3}/", "\n\n\n", $tokens[$key+1][1]);
				}

			}

			--$curly_braces_count;

		} elseif (
			$token === "{" or (
				is_array($token) and (
					$token[0] === T_CURLY_OPEN or
					$token[0] === T_DOLLAR_OPEN_CURLY_BRACES
				)
			)
		) {

			++$curly_braces_count;
			$curly_brace_opener[$curly_braces_count] = $control_structure;

		}

	}

}


/**
 * Indenting
 *
 * @param array   $tokens (reference)
 */
function indent(&$tokens) {

	// Level of curly brackets
	$curly_braces_count = 0;
	// Level of round brackets
	$round_braces_count = 0;

	$round_brace_opener = false;
	$round_braces_control = 0;

	// Number of opened control structures without curly brackets inside of a level of curly brackets
	$control_structure = array(0);

	$heredoc_started = false;
	$trinity_started = false;

	foreach ( $tokens as $key => &$token ) {

		// Skip HEREDOC
		if ( $heredoc_started ) {
			if ( isset($token[0]) and $token[0] === T_END_HEREDOC ) {
				$heredoc_started = false;
			}
			continue;
		}

		// Detect beginning of a HEREDOC block
		if ( isset($token[0]) and $token[0] === T_START_HEREDOC ) {
			$heredoc_started = true;
			continue;
		}

		// The closing bracket itself has to be not indented again, so we decrease the brackets count before we reach the bracket.
		if (isset($tokens[$key+1])) {
			if (is_string($tokens[$key+1])) {
				if (
					is_string($token) or
					$token[0] !== T_WHITESPACE or
					strpos($token[1], "\n")!==false
				) {
					if     ($tokens[$key+1] === "}") --$curly_braces_count;
					elseif ($tokens[$key+1] === ")") --$round_braces_count;
				}
			} else {
				if (
					// If the next token is a T_WHITESPACE without a \n, we have to look at the one after the next.
					isset($tokens[$key+2]) and
					$tokens[$key+1][0] === T_WHITESPACE and
					strpos($tokens[$key+1][1], "\n")===false
				) {
					if     ($tokens[$key+2] === "}") --$curly_braces_count;
					elseif ($tokens[$key+2] === ")") --$round_braces_count;
				}
			}
		}

		if     ($token === "(") ++$round_braces_control;
		elseif ($token === ")") --$round_braces_control;

		if ( $token === "(" ) {

			if ($round_braces_control==1) {
				// Remember which command was before the bracket
				$k = $key;
				do {
					--$k;
				} while (
					isset($tokens[$k]) and (
						$tokens[$k][0] === T_WHITESPACE or
						$tokens[$k][0] === T_STRING
					)
				);
				if (is_array($tokens[$k])) {
					$round_brace_opener = $tokens[$k][0];
				} else {
					$round_brace_opener = false;
				}
			}

			++$round_braces_count;

		} elseif (
			(
				$token === ")" and
				$round_braces_control == 0 and
				in_array(
					$round_brace_opener,
					array(T_IF, T_ELSEIF, T_WHILE, T_FOR, T_FOREACH, T_SWITCH, T_FUNCTION)
				)
			) or (
				is_array($token) and (
					$token[0] === T_ELSE or $token[0] === T_DO
				)
			)
		) {
			// All control stuctures end with a curly bracket, except "else" and "do".
			if (isset($control_structure[$curly_braces_count])) {
				++$control_structure[$curly_braces_count];
			} else {
				$control_structure[$curly_braces_count] = 1;
			}

		} elseif ( $token === ";" or $token === "}" ) {
			// After a command or a set of commands a control structure is closed.
			if (!empty($control_structure[$curly_braces_count])) --$control_structure[$curly_braces_count];

		} else {
			indent_text(
				$tokens,
				$key,
				$curly_braces_count,
				$round_braces_count,
				$control_structure,
				(is_array($token) and $token[0] === T_DOC_COMMENT),
				$trinity_started
			);

		}

		if (
			$token === "{" or (
				is_array($token) and (
					$token[0] === T_CURLY_OPEN or
					$token[0] === T_DOLLAR_OPEN_CURLY_BRACES
				)
			)
		) {
			// If a curly bracket occurs, no command without brackets can follow.
			if (!empty($control_structure[$curly_braces_count])) --$control_structure[$curly_braces_count];
			++$curly_braces_count;
			// Inside of the new level of curly brackets it starts with no control structure.
			$control_structure[$curly_braces_count] = 0;
		}

	}

}


/**
 * Indents one token
 *
 * @param array   $tokens             (reference)
 * @param integer $key
 * @param integer $curly_braces_count
 * @param integer $round_braces_count
 * @param array   $control_structure
 * @param boolean $docblock
 * @param boolean $trinity_started    (reference)
 */
function indent_text(&$tokens, $key, $curly_braces_count, $round_braces_count, $control_structure, $docblock, &$trinity_started) {

	if ( is_string($tokens[$key]) ) {
		$text =& $tokens[$key];
		// If there is no line break it is only a inline string, not involved in indenting
		if ( strpos($text, "\n")===false ) return;
	} else {
		$text =& $tokens[$key][1];
		// If there is no line break it is only a inline string, not involved in indenting
		if ( strpos($text, "\n")===false ) return;
		if (token_is_taboo($tokens[$key])) return;
	}

	$indent = $curly_braces_count + $round_braces_count;
	for ( $i=0; $i<=$curly_braces_count; ++$i ) {
		$indent += $control_structure[$i];
	}

	// One indentation level less for "switch ... case ... default"
	if (
		isset($tokens[$key+1]) and
		is_array($tokens[$key+1]) and (
			$tokens[$key+1][0] === T_CASE or
			$tokens[$key+1][0] === T_DEFAULT or (
				isset($tokens[$key+2]) and
				is_array($tokens[$key+2]) and (
					$tokens[$key+2][0] === T_CASE or
					$tokens[$key+2][0] === T_DEFAULT
				) and
				// T_WHITESPACE without \n first
				$tokens[$key+1][0] === T_WHITESPACE and
				strpos($tokens[$key+1][1], "\n")===false
			)
		)
	) --$indent;

	// One indentation level less for an opening curly brace on a seperate line
	if (
		isset($tokens[$key+2]) and (
			$tokens[$key+1] === "{" or (
				is_array($tokens[$key+1]) and (
					$tokens[$key+1][0] === T_CURLY_OPEN or
					$tokens[$key+1][0] === T_DOLLAR_OPEN_CURLY_BRACES
				)
			)
		) and (
			is_array($tokens[$key+2]) and
			$tokens[$key+2][0] === T_WHITESPACE and
			strpos($tokens[$key+2][1], "\n")!==false
		) and (
			// Only if the curly brace belongs to a control structure
			$control_structure[$curly_braces_count] > 0
		)
	) --$indent;

	// One additional indentation level for operators at the beginning or the end of a line
	if (!$round_braces_count) {

		static $operators = array(
			// arithmetic
			"+",
			"-",
			"*",
			"/",
			"%",
			// assignment
			"=",
			array(T_PLUS_EQUAL,  "+="),
			array(T_MINUS_EQUAL, "-="),
			array(T_MUL_EQUAL,   "*="),
			array(T_DIV_EQUAL,   "/="),
			array(T_MOD_EQUAL,   "%="),
			array(T_AND_EQUAL,   "&="),
			array(T_OR_EQUAL,    "|="),
			array(T_XOR_EQUAL,   "^="),
			// bitwise
			"&",
			"|",
			"^",
			array(T_SL, "<<"),
			array(T_SR, ">>"),
			// comparison
			array(T_IS_EQUAL,         "=="),
			array(T_IS_IDENTICAL,     "==="),
			array(T_IS_NOT_EQUAL,     "!="),
			array(T_IS_NOT_EQUAL,     "<>"),
			array(T_IS_NOT_IDENTICAL, "!=="),
			"<",
			">",
			array(T_IS_SMALLER_OR_EQUAL, "<="),
			array(T_IS_GREATER_OR_EQUAL, ">="),
			// logical
			array(T_LOGICAL_AND, "and"),
			array(T_LOGICAL_OR,  "or"),
			array(T_LOGICAL_XOR, "xor"),
			array(T_BOOLEAN_AND, "&&"),
			array(T_BOOLEAN_OR,  "||"),
			// string
			".",
			array(T_CONCAT_EQUAL, ".="),
			// type
			array(T_INSTANCEOF, "instanceof")
		);

		if (
			(isset($tokens[$key+1]) and in_array($tokens[$key+1], $operators)) or
			(isset($tokens[$key-1]) and in_array($tokens[$key-1], $operators))
		) {
			++$indent;
		} elseif (
			(isset($tokens[$key+1]) and $tokens[$key+1] === "?") or
			(isset($tokens[$key-1]) and $tokens[$key-1] === "?")
		) {
			++$indent;
			$trinity_started = true;
		} elseif (
			$trinity_started and (
				(isset($tokens[$key+1]) and $tokens[$key+1] === ":") or
				(isset($tokens[$key-1]) and $tokens[$key-1] === ":")
			)
		) {
			++$indent;
			$trinity_started = false;
		}

	}

	$indent_str = str_repeat($GLOBALS['indent_char'], max($indent, 0));

	// Indent the current token
	$text = preg_replace(
		"/\n[ \t]*/",
		"\n".$indent_str.($docblock?" ":""),
		$text
	);

	// Cut the indenting at the beginning of the next token

	// End of file reached
	if ( !isset($tokens[$key+1]) ) return;

	if ( is_string($tokens[$key+1]) ) {
		$text2 =& $tokens[$key+1];
	} else {
		$text2 =& $tokens[$key+1][1];
	}

	// Remove indenting at beginning of the the next token
	$text2 = preg_replace(
		"/^[ \t]*/",
		"",
		$text2
	);

}


/**
 * Strips indenting before single closing PHP tags
 *
 * @param array   $tokens (reference)
 */
function strip_closetag_indenting(&$tokens) {

	foreach ( $tokens as $key => &$token ) {
		if ( is_string($token) ) continue;
		if (
			// T_CLOSE_TAG with following \n
			$token[0] === T_CLOSE_TAG and
			substr($token[1], -1) === "\n"
		) {
			if (
				// T_WHITESPACE or T_COMMENT before with \n at the end
				isset($tokens[$key-1]) and
				is_array($tokens[$key-1]) and
				($tokens[$key-1][0] === T_WHITESPACE or $tokens[$key-1][0] === T_COMMENT) and
				preg_match("/\n[ \t]*$/", $tokens[$key-1][1])
			) {
				$tokens[$key-1][1] = preg_replace("/\n[ \t]*$/", "\n", $tokens[$key-1][1]);
			} elseif (
				// T_WHITESPACE before without \n
				isset($tokens[$key-1]) and
				is_array($tokens[$key-1]) and
				$tokens[$key-1][0] === T_WHITESPACE and
				strpos($tokens[$key-1][1], "\n")===false and
				// T_WHITESPACE before or T_COMMENT with \n at the end
				isset($tokens[$key-2]) and
				is_array($tokens[$key-2]) and
				($tokens[$key-2][0] === T_WHITESPACE or $tokens[$key-2][0] === T_COMMENT) and
				preg_match("/\n[ \t]*$/", $tokens[$key-2][1])
			) {
				$tokens[$key-1] = "";
				$tokens[$key-2][1] = preg_replace("/\n[ \t]*$/", "\n", $tokens[$key-2][1]);
			}
		}
	}

}


//////////////// PHPDOC FUNCTIONS ///////////////////


/**
 * Gets all defined functions
 *
 * Functions inside of curly braces will be ignored.
 *
 * @param string  $content
 * @return array
 */
function get_functions(&$content) {

	$tokens = get_tokens($content);

	$functions = array();
	$curly_braces_count = 0;
	foreach ( $tokens as $key => &$token ) {

		if (is_string($token)) {
			if     ($token === "{") ++$curly_braces_count;
			elseif ($token === "}") --$curly_braces_count;
		} elseif (
			$token[0] === T_FUNCTION and
			$curly_braces_count === 0 and
			isset($tokens[$key+2]) and
			is_array($tokens[$key+2])
		) {
			$functions[] = $tokens[$key+2][1];
		}

	}

	return $functions;
}


/**
 * Gets all defined includes
 *
 * @param array   $seetags (reference)
 * @param string  $content
 * @param string  $file
 */
function find_includes(&$seetags, &$content, $file) {

	$tokens = get_tokens($content);

	foreach ( $tokens as $key => &$token ) {
		if (is_string($token)) continue;

		if ( !in_array($token[0], array(T_REQUIRE, T_REQUIRE_ONCE, T_INCLUDE, T_INCLUDE_ONCE)) ) continue;

		$t = get_argument_tokens($tokens, $key);
		strip_whitespace($t);

		// Strip round brackets
		if ( $t[0] === "(" and $t[count($t)-1] === ")" ) {
			$t = array_splice($t, 1, -1);
		}

		if (!$t) {
			possible_syntax_error($tokens, $key, "Missing argument");
			continue;
		}

		if (!is_array($t[0])) continue;

		// Strip leading docroot variable or constant
		if (
			($t[0][0] === T_VARIABLE or $t[0][0] === T_STRING) and
			in_array($t[0][1], $GLOBALS['docrootvars']) and
			$t[1] === "."
		) {
			$t = array_splice($t, 2);
		}

		if (
			count($t) == 1 and
			$t[0][0] === T_CONSTANT_ENCAPSED_STRING
		) {
			$includedfile = substr($t[0][1], 1, -1);
			$seetags[$includedfile][] = array($file);
			continue;
		}

		if (!$t) {
			possible_syntax_error($tokens, $key, "String concatenator without following string");
		}

	}

}


/**
 * Replaces one DocTag in a DocBlock
 *
 * Existing valid DocTags will be used without change
 *
 * @param string  $text    Content of the DocBlock
 * @param string  $tagname Name of the tag
 * @param array   $tags    All tags to be inserted
 * @return string
 */
function add_doctags_to_doc_comment($text, $tagname, $tags) {

	if (!count($tags)) return $text;

	// Replacement for array_unique()
	$tagids = array();
	foreach ( $tags as $key => $tag ) {
		if ( !in_array($tag[0], $tagids) ) {
			$tagids[] = $tag[0];
		} else {
			unset($tags[$key]);
		}
	}

	$oldtags = array();

	$lines = explode("\n", $text);

	$newtext = "";
	foreach ( $lines as $key => $line ) {

		// Add doctags after the last line
		if ( $key == count($lines)-1 ) {
			foreach ( $tags as $tag ) {
				$tagid = $tag[0];
				if ( isset($oldtags[$tagid]) and count($oldtags[$tagid]) ) {

					// Use existing line
					foreach ( $oldtags[$tagid] as $oldtag ) {

						if (
							$tagname == "param" and
							preg_match('/^\s*\*\s+@param\s+([A-Za-z0-9_]+)\s+(\$[A-Za-z0-9_]+)\s+(.*)$/', $oldtag, $matches)
						) {

							// Replace param type if a type hint exists
							if (empty($tag[1])) $tag[1] = $matches[1];

							// Add comment for optional and reference if not already existing
							if (
								isset($tag[2]) and
								substr($matches[3], 0, strlen($tag[2])) != $tag[2]
							) {
								$matches[3] = $tag[2]." ".$matches[3];
							}

							$newtext .= "* @param ".$tag[1]." ".$tag[0]." ".$matches[3]."\n";

						} else {
							// Take old line without changes
							$newtext .= $oldtag."\n";
						}

					}

				} else {

					// Add new line
					switch ($tagname) {
					case "param":
						if (empty($tag[1])) $tag[1] = "unknown";
						$newtext .= "* @param ".$tag[1]." ".$tag[0].(isset($tag[2])?" ".$tag[2]:"")."\n";
						break;
					case "uses":
						$newtext .= "* @uses ".$tag[0]."()\n";
						break;
					case "return":
						$newtext .= "* @return unknown\n";
						break;
					case "author":
						if ($GLOBALS['default_author']) {
							$newtext .= "* @author ".$GLOBALS['default_author']."\n";
						}
						break;
					case "package":
						$newtext .= "* @package ".$GLOBALS['default_package']."\n";
						break;
					case "see":
						$newtext .= "* @see ".$tag[0]."\n";
						break;
					}

				}

			}
		}

		// Match DocTag
		$regex = '^\s*\*\s+@'.$tagname;
		// Match param tag variable
		if ($tagname=="param") $regex .= '[^\$]*(\$[A-Za-z0-9_]+)';
		if ( preg_match('/'.$regex.'/', $line, $matches) ) {
			if ($tagname=="param") $oldtags[$matches[1]][] = $line;
			else                   $oldtags[""][]          = $line;
		} else {
			// Don't change lines without a DocTag
			$newtext .= $line;
			// Add a line break after every line except the last
			if ( $key != count($lines)-1 ) $newtext.="\n";
		}

	}

	return $newtext;
}


/**
 * Collects the doctags for a function docblock
 *
 * @param array   $tokens (reference)
 * @return array
 */
function collect_doctags(&$tokens) {

	$function_declarations = array();
	$function = "";
	$curly_braces_count = 0;

	$usestags = array();
	$paramtags = array();
	$returntags = array();

	foreach ( $tokens as $key => &$token ) {

		if (is_string($token)) {

			if ($token === "{") {
				++$curly_braces_count;
			} elseif ($token === "}") {
				if (--$curly_braces_count==0) $function = "";
			}

		} else {

			switch ($token[0]) {
			case T_FUNCTION:
				// Find function definitions

				$round_braces_count = 0;

				$k = $key + 1;

				if ( is_string($tokens[$k]) or $tokens[$k][0] !== T_WHITESPACE ) {
					possible_syntax_error($tokens, $k, "No whitespace found between function keyword and function name");
					break;
				}

				++$k;

				// & before function name
				if ( $tokens[$k] === "&" ) ++$k;

				if ( is_string($tokens[$k]) or $tokens[$k][0] !== T_STRING ) {
					possible_syntax_error($tokens, $k, "No string for function name found");
					break;
				}

				$function = $tokens[$k][1];
				$function_declarations[] = $key;

				// Collect param-doctags
				$k += 2;
				// Area between round brackets
				$reference = false;
				while ( ($tokens[$k] != ")" or $round_braces_count) and $k < count($tokens) ) {
					if ( is_string($tokens[$k]) ) {
						if     ($tokens[$k] === "(") ++$round_braces_count;
						elseif ($tokens[$k] === ")") --$round_braces_count;
						elseif ($tokens[$k] === "&") $reference = true;
					} else {
						$typehint = false;
						if (
							$tokens[$k][0] === T_VARIABLE
						) {
							$typehint = "";
						} elseif (
							$tokens[$k][0] === T_ARRAY and
							isset($tokens[$k+1][0]) and $tokens[$k+1][0] === T_WHITESPACE and
							isset($tokens[$k+2][0]) and $tokens[$k+2][0] === T_VARIABLE
						) {
							$k += 2;
							$typehint = "array";
						} elseif (
							$tokens[$k][0] === T_STRING and
							isset($tokens[$k+1][0]) and $tokens[$k+1][0] === T_WHITESPACE and
							isset($tokens[$k+2][0]) and $tokens[$k+2][0] === T_VARIABLE
						) {
							$k += 2;
							$typehint = "object";
						}
						if ($typehint !== false) {
							$comments = array();
							if (
								(isset($tokens[$k+1]) and $tokens[$k+1] === "=") or (
									isset($tokens[$k+1][0]) and $tokens[$k+1][0] === T_WHITESPACE and
									isset($tokens[$k+2]) and $tokens[$k+2] === "="
								)
							) {
								$comments[] = "optional";
							}
							if ($reference) {
								$comments[] = "reference";
								$reference = false;
							}
							if (count($comments)) {
								$comment = "(".join(", ", $comments).")";
							} else {
								$comment = "";
							}
							$paramtags[$function][] = array($tokens[$k][1], $typehint, $comment);
						}
					}
					++$k;
				}
				break;
			case T_CURLY_OPEN:
			case T_DOLLAR_OPEN_CURLY_BRACES:
				++$curly_braces_count;
				break;
			case T_STRING:
				// Find function calls
				if (
					$tokens[$key+1] === "(" and
					!in_array($key-2, $function_declarations) and
					in_array($token[1], $GLOBALS['functions'])
				) {
					$usestags[$function][] = array($token[1]);
				}
				break;
			case T_RETURN:
				// Find returns
				if (
					$tokens[$key+1] != ";" and
					$tokens[$key+2] != ";"
				) {
					$returntags[$function][] = array("");
				}
				break;
			}

		}

	}

	return array($usestags, $paramtags, $returntags);
}


/**
 * Adds file DocBlocks where missing
 *
 * @param array   $tokens (reference)
 */
function add_file_docblock(&$tokens) {

	$default_file_docblock = "/**\n".
		" * ".$GLOBALS['file']."\n".
		" *\n";
	if ($GLOBALS['default_author']) {
		$default_file_docblock .= " * @author ".$GLOBALS['default_author']."\n";
	}
	$default_file_docblock .= " * @package ".$GLOBALS['default_package']."\n".
		" */";

	// File begins with PHP
	switch ($tokens[0][0]) {
	case T_OPEN_TAG:

		if ($GLOBALS['open_tag']=="<?") {
			if ( $tokens[1][0] === T_WHITESPACE and $tokens[2][0] === T_DOC_COMMENT ) return;
			// Insert new file docblock after open tag
			array_splice($tokens, 0, 1, array(
					array(T_OPEN_TAG, "<?"),
					array(T_WHITESPACE, "\n"),
					array(T_DOC_COMMENT, $default_file_docblock),
					array(T_WHITESPACE, "\n")
				));
		} else {
			if ( $tokens[1][0] === T_DOC_COMMENT ) return;
			// Insert new file docblock after open tag
			array_splice($tokens, 0, 1, array(
					array(T_OPEN_TAG, $GLOBALS['open_tag']."\n"),
					array(T_DOC_COMMENT, $default_file_docblock),
					array(T_WHITESPACE, "\n")
				));
		}

		break;
	case T_INLINE_HTML:

		if ( preg_match("/^#!\//", $tokens[0][1]) ) {
			// File begins with "shebang"-line for direct execution

			if ($GLOBALS['open_tag']=="<?") {
				if ( $tokens[2][0] === T_WHITESPACE and $tokens[3][0] === T_DOC_COMMENT ) return;
				// Insert new file docblock after open tag
				array_splice($tokens, 1, 1, array(
						array(T_OPEN_TAG, "<?"),
						array(T_WHITESPACE, "\n"),
						array(T_DOC_COMMENT, $default_file_docblock),
						array(T_WHITESPACE, "\n")
					));
			} else {
				if ( $tokens[2][0] === T_DOC_COMMENT ) return;
				// Insert new file docblock after open tag
				array_splice($tokens, 1, 1, array(
						array(T_OPEN_TAG, $GLOBALS['open_tag']."\n"),
						array(T_DOC_COMMENT, $default_file_docblock),
						array(T_WHITESPACE, "\n")
					));
			}

		} else {
			// File begins with HTML

			// Insert new file docblock in open and close tags at the beginning of the file
			if ($GLOBALS['open_tag']=="<?") {
				array_splice($tokens, 0, 0, array(
						array(T_OPEN_TAG, "<?"),
						array(T_WHITESPACE, "\n"),
						array(T_DOC_COMMENT, $default_file_docblock),
						array(T_WHITESPACE, "\n\n\n"),
						array(T_CLOSE_TAG, "?>\n")
					));
			} else {
				array_splice($tokens, 0, 0, array(
						array(T_OPEN_TAG, $GLOBALS['open_tag']."\n"),
						array(T_DOC_COMMENT, $default_file_docblock),
						array(T_WHITESPACE, "\n\n\n"),
						array(T_CLOSE_TAG, "?>\n")
					));
			}

		}

	}

}


/**
 * Adds funktion DocBlocks where missing
 *
 * @param array   $tokens (reference)
 */
function add_function_docblocks(&$tokens) {

	foreach ( $tokens as $key => &$token ) {

		if ( is_string($token) or $token[0] !== T_FUNCTION ) continue;

		// Find beginning of the function declaration
		$k = $key;
		while (
			isset($tokens[$k-1]) and
			strpos(token_text($tokens[$k-1]), "\n")===false
		) --$k;

		if (
			!isset($tokens[$k-2]) or
			!is_array($tokens[$k-2]) or
			$tokens[$k-2][0] != T_DOC_COMMENT
		) {

			// Collect old non-phpdoc comments
			$comment = "";
			$replace = 0;
			while (
				isset($tokens[$k-1]) and
				is_array($tokens[$k-1]) and
				$tokens[$k-1][0] === T_COMMENT
			) {
				$comment = " * ".trim(ltrim(trim($tokens[$k-1][1]), "/#"))."\n".$comment;
				--$k;
				++$replace;
			}

			if (!$comment) $comment = " *\n";

			array_splice($tokens, $k, $replace, array(
					array(T_DOC_COMMENT, "/**\n".
						$comment.
						" */"),
					array(T_WHITESPACE, "\n")
				));

		}

	}

}


/**
 * Adds DocTags to file or function DocBlocks
 *
 * @param array   $tokens     (reference)
 * @param array   $usetags
 * @param array   $paramtags
 * @param array   $returntags
 * @param array   $seetags
 */
function add_doctags(&$tokens, $usetags, $paramtags, $returntags, $seetags) {

	$filedocblock = false;

	foreach ( $tokens as $key => &$token ) {

		if (is_string($token)) continue;
		list($id, $text) = $token;
		if ($id != T_DOC_COMMENT) continue;

		$k = $key + 1;
		while ( in_array($tokens[$k][0], array(T_WHITESPACE, T_STATIC, T_PUBLIC, T_PROTECTED, T_PRIVATE)) ) ++$k;

		if (
			$tokens[$k][0] === T_FUNCTION and
			$tokens[$k+1][0] === T_WHITESPACE and
			$tokens[$k+2][0] === T_STRING
		) {

			// Function DocBlock
			$f = $tokens[$k+2][1];
			if (isset($paramtags[$f])) {
				$tokens[$key] = array($id, add_doctags_to_doc_comment($tokens[$key][1], "param", $paramtags[$f]));
			}
			if (isset($returntags[$f])) {
				$tokens[$key] = array($id, add_doctags_to_doc_comment($tokens[$key][1], "return", $returntags[$f]));
			}
			if (isset($usestags[$f])) {
				$tokens[$key] = array($id, add_doctags_to_doc_comment($tokens[$key][1], "uses", $usestags[$f]));
			}

		} elseif ( !$filedocblock ) {

			// File DocBlock
			if (isset($usestags[""])) {
				$tokens[$key] = array($id, add_doctags_to_doc_comment($tokens[$key][1], "uses", $usestags[""]));
			}
			$tokens[$key] = array($id, add_doctags_to_doc_comment($tokens[$key][1], "author", array(array(""))));
			$tokens[$key] = array($id, add_doctags_to_doc_comment($tokens[$key][1], "package", array(array(""))));
			if (isset($seetags[$GLOBALS['file']])) {
				$tokens[$key] = array($id, add_doctags_to_doc_comment($tokens[$key][1], "see", $seetags[$GLOBALS['file']]));
			}

		}

		$filedocblock = true;

	}

}
?>