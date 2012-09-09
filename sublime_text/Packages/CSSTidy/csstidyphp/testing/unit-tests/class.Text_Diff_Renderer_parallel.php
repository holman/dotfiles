<?php

/**
 * Parallel diff renderer for HTML tables with original text on left,
 * new text on right, and changed text highlighted with appropriate classes.
 */
class Text_Diff_Renderer_parallel extends Text_Diff_Renderer
{
    /** String header for left column */
    var $original = 'Original';
    /** String header for right column */
    var $final    = 'Final';
    var $_leading_context_lines = 10000; // these are big to ensure entire string is output
    var $_trailing_context_lines = 10000;
    function _blockHeader() {}
    function _startDiff() {
        return '<table class="diff"><thead><tr><th>'. $this->original .'</th><th>'. $this->final .'</th></tr></thead><tbody>';
    }
    function _endDiff() {
        return '</tbody></table>';
    }
    function _context($lines) {
        return '<tr><td><pre>'. htmlspecialchars(implode("\n", $lines)) .'</pre></td>
          <td><pre>'. htmlspecialchars(implode("\n", $lines)) .'</pre></td></tr>';
    }
    function _added($lines) {
        return '<tr><td>&nbsp;</td><td class="added"><pre>'. htmlspecialchars(implode("\n", $lines)) .'</pre></td></tr>';
    }
    function _deleted($lines) {
        return '<tr><td class="deleted"><pre>'. htmlspecialchars(implode("\n", $lines)) .'</pre></td><td>&nbsp;</td></tr>';
    }
    function _changed($orig, $final) {
        return '<tr class="changed"><td><pre>'. htmlspecialchars(implode("\n", $orig)) .'</pre></td>
        <td><pre>'. htmlspecialchars(implode("\n", $final)) .'</pre></td></tr>';
    }
}
