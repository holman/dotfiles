<?php

/**
 * Custom test reporter for CSSTidy, adds appropriate CSS declarations
 * for diffs.
 */
class csstidy_reporter extends HTMLReporter
{
    
    function _getCss() {
        $css = parent::_getCss();
        $css .= '
.diff {margin-bottom: 1em;}
.diff th {width:50%;}
.diff pre {margin:0; padding:0; background:none;}
.diff .changed, .diff .deleted, .diff .added {background: #FF5;}
        ';
        return $css;
    }
    
}
