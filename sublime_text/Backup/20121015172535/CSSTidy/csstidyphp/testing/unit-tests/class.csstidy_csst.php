<?php

require_once 'class.Text_Diff_Renderer_parallel.php';

/**
 * CSSTidy CSST expectation, for testing CSS parsing.
 */
class csstidy_csst extends SimpleExpectation
{
    /** Filename of test */
    var $filename;
    
    /** Test name */
    var $test;
    
    /** CSS for test to parse */
    var $css = '';
    
    /** Settings for csstidy */
    var $settings = array();
    
    /** Expected var_export() output of $css->css[41] (no at block) */
    var $expect = '';
    
    /** Boolean whether or not to use $css->css instead for $expect */
    var $fullexpect = false;

		/** Print form of CSS that can be tested **/
    var $print = false;
		var $default_media = "";

    /** Actual result */
    var $actual;
    
    /**
     * Loads this class from a file.
     * @param $filename String filename to load
     */
    function load($filename) {
        $this->filename = $filename;
        $fh = fopen($filename, 'r');
        $state = '';
        while (($line = fgets($fh)) !== false) {
            $line = rtrim($line, "\n\r"); // normalize newlines
            if (substr($line, 0, 2) == '--') {
                // detected section
                $state = $line;
                continue;
            }
            if ($state === null) continue;
            switch ($state) {
                case '--TEST--':
                    $this->test    = trim($line);
                    break;
                case '--CSS--':
                    $this->css    .= $line . "\n";
                    break;
                case '--FULLEXPECT--':
                    $this->fullexpect = true;
                    $this->expect .= $line . "\n";
                    break;
                case '--EXPECT--':
                    $this->expect .= $line . "\n";
                    break;
                case '--SETTINGS--':
                    list($n, $v) = array_map('trim',explode('=', $line, 2));
                    $v = eval("return $v;");
                    if ($n=="default_media" AND $this->print)
	                    $this->default_media = $v;
                    else
                      $this->settings[$n] = $v;
                    break;
                case '--PRINT--':
                    $this->print = true;
                    $this->expect .= $line . "\n";
                    break;
            }
        }
				if ($this->print) {
					$this->expect = trim($this->expect);
				}
				else {
					if ($this->expect)
						$this->expect = eval("return ".$this->expect.";");
					if (!$this->fullexpect)
						$this->expect = array(41=>$this->expect);
				}
        fclose($fh);
    }
    
    /**
     * Implements SimpleExpectation::test().
     * @param $filename Filename of test file to test.
     */
    function test($filename = false) {
        if ($filename) $this->load($filename);
        $css = new csstidy();
        $css->set_cfg($this->settings);
        $css->parse($this->css);
				if ($this->print){
					$this->actual = $css->print->plain($this->default_media);
				}
				else{
					$this->actual = $css->css;
				}
        return $this->expect === $this->actual;
    }
    
    /**
     * Implements SimpleExpectation::testMessage().
     */
    function testMessage() {
        $message = $this->test . ' test at '. htmlspecialchars($this->filename);
        return $message;
    }
    
    /**
     * Renders the test with an HTML diff table.
     */
    function render() {
        $message = '<pre>'. htmlspecialchars($this->css) .'</pre>';
        $diff = new Text_Diff(
						'auto',
						array(
								explode("\n", $this->print?$this->expect:var_export($this->expect,true)),
								explode("\n", $this->print?$this->actual:var_export($this->actual,true))
						)
				);
        $renderer = new Text_Diff_Renderer_parallel();
        $renderer->original = 'Expected';
        $renderer->final    = 'Actual';
        $message .= $renderer->render($diff);
        return $message;
    }
}
