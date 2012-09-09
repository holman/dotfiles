#!/usr/bin/php
<?php
// Includes
include 'csstidyphp/class.csstidy.php' ;

// Get arguments. Dummy for short options
$long_options = array(
  "allow_html_in_templates::",
  "compress_colors::",
  "compress_font::",
  "discard_invalid_properties::",
  "lowercase_s::",
  "preserve_css::",
  "remove_bslash::",
  "remove_last_;::",
  "silent::",
  "sort_properties::",
  "sort_selectors::",
  "timestamp::",
  "merge_selectors::",
  "case_properties::",
  "optimise_shorthands::",
  "template::"
);
$args = getopt("nyc", $long_options);

// Create tidier
$css = new csstidy();

if (isset($args['template'])):
    switch ($args['template']):
       case 'highest':
        $css->load_template('highest_compression');
        break;
       
       case 'high':
        $css->load_template('high_compression');
        break;
       
       case 'default':
        $css->load_template('default');
        break;

       case 'low':
        $css->load_template('low_compression');
        break;
       
       default:
          if (file_exists($args['template'])):
            $css->load_template($args['template'], true);
          else:
            $css->load_template('default');
          endif;
        break;
     endswitch;
endif;

// Set config options
foreach ($long_options as $option):
  // Important line: make sure PHP recognizes option name
  $option = trim($option, ":");
  if (isset($args[$option]) and $option != 'template'):
      $css->set_cfg($option, $args[$option]);
  endif;
endforeach;

// read from pipe, parse, write to pipe
$input = stream_get_contents(STDIN);
$css->parse($input);
fwrite(STDOUT, $css->print->plain());

/*
// Is there an error handler in csstidyphp? I don't think so?
if ( SOME_KIND_OF_ERROR_OPTION ) {
    fwrite(STDERR, $css->ERRORS);
}
*/
?>