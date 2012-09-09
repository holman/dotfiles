<?php
/**
 * tidy.php
 *
 * See README for more information.
 *
 */

error_reporting( E_ALL );

//////////////// VARIABLES ///////////////////

// some, but not all options for tidy
// found on tidy.sourceforge.net/docs/quickref.html
// and tidy.sourceforge.net/docs/tidy_man.html
// '::' marks all as optional

$short_options = 'o::' .
    'f::' .
    'm::' .
    'i::' .
    'w::' .
    'u::' .
    'c::' .
    'b::' .
    'n::' .
    'e::' .
    'q::' .
    'v::' .
    'h::' ;

$long_options = array(
    'add-xml-decl::',
    'add-xml-space::',
    'alt-text::',
    'anchor-as-name::',
    'assume-xml-procins::',
    'bare::',
    'clean::',
    'css-prefix::',
    'decorate-inferred-ul::',
    'doctype DocType auto::',
    'drop-empty-paras::',
    'drop-font-tags::',
    'drop-proprietary-attributes::',
    'enclose-block-text::',
    'enclose-text::',
    'escape-cdata::',
    'fix-backslash::',
    'fix-bad-comments::',
    'fix-uri::',
    'hide-comments::',
    'hide-endtags::',
    'indent-cdata::',
    'input-xml::',
    'join-classes::',
    'join-styles::',
    'literal-attributes::',
    'logical-emphasis::',
    'lower-literals::',
    'merge-divs::',
    'merge-spans::',
    'ncr::',
    'new-blocklevel-tags::',
    'new-empty-tags::',
    'new-inline-tags::',
    'new-pre-tags::',
    'numeric-entities::',
    'output-html::',
    'output-xhtml::',
    'output-xml::',
    'preserve-entities::',
    'quote-ampersand::',
    'quote-marks::',
    'quote-nbsp::',
    'repeated-attributes::',
    'replace-color::',
    'show-body-only::',
    'uppercase-attributes::',
    'uppercase-tags::',
    'word-2000::',
    'break-before-br::',
    'indent::',
    'indent-attributes::',
    'indent-spaces::',
    'markup::',
    'punctuation-wrap::',
    'sort-attributes::',
    'split::',
    'tab-size::',
    'vertical-space::',
    'wrap::',
    'wrap-asp::',
    'wrap-attributes::',
    'wrap-jste::',
    'wrap-php::',
    'wrap-script-literals::',
    'wrap-sections::',
    'ascii-chars::',
    'char-encoding::',
    'input-encoding::',
    'language::',
    'newline::',
    'output-bom::',
    'output-encoding::',
    'error-file::',
    'force-output::',
    'gnu-emacs::',
    'gnu-emacs-file::',
    'keep-time::',
    'output-file::',
    'tidy-mark::',
    'write-back::'
);

///////////// PROCEDURES ////////////////

if ( !version_compare( phpversion(), "5.2", ">=" ) ) {
    echo( "Error: tidy.php requires PHP 5.2 or newer.\n" );
    echo( "You are using PHP ".phpversion() );
    exit( 1 );
}

if ( ! class_exists('Tidy') ) {
    echo( "Error: tidy.php requires PHP 5 with libtidy support built in.\n" );
    exit( 1 );
}

// Parse arguments using the lists above.
// $arguments = getopt( $short_options, $long_options );
// $input = stream_get_contents(STDIN);


$arguments = stripslashes( $_POST['arguments'] );
$input = base64_decode( $_POST['content'] );

// print_r($arguments);
// print_r($input);

// convert python list as string to php array
$arguments = substr( $arguments, 2, -2);
$arguments = explode("', '", $arguments);

// remove first item 'webservice'
array_shift($arguments);

$tidy_arguments = array();
for ($i=0; $i < count($arguments); $i+=2) { 
    $arg = substr( $arguments[$i], 2);
    $val = $arguments[$i+1];
    $tidy_arguments[ $arg ] = $val;
}


try {
    $tidy = new Tidy();
    $tidy->parseString( $input, $tidy_arguments, 'utf8' );

} catch (Exception $e) {
    echo( "Error: PHP doesn't have libtidy installed.\n" );
    exit( 1 );
}

echo $tidy;

// maybe later pass result as json and pass errors and warnings too...
// if ( $tidy->errorBuffer ) {
//     echo "\n\n-----\n";
//     echo $tidy->errorBuffer;
// }

