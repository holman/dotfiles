<?php

/**@file
 * Script for unit testing, allows for more fine grained error reporting
 * when things go wrong.
 * @author Edward Z. Yang <admin@htmlpurifier.org>
 *
 * Required
 * unit-tets/Text : http://download.pear.php.net/package/Text_Diff-1.1.1.tgz
 * unit-tests/simpletest/ : http://downloads.sourceforge.net/project/simpletest/simpletest/simpletest_1.0.1/simpletest_1.0.1.tar.gz?r=&ts=1289748853&use_mirror=freefr
 *
 */

error_reporting(E_ALL ^ 8192/*E_DEPRECATED*/);

// Configuration
$simpletest_location = 'simpletest/';
if (file_exists('../test-settings.php')) include_once '../test-settings.php';

// Includes
require_once '../class.csstidy.php';
require_once 'Text/Diff.php';
require_once 'Text/Diff/Renderer.php';
require_once $simpletest_location . 'unit_tester.php';
require_once $simpletest_location . 'reporter.php';
require_once 'unit-tests/class.csstidy_reporter.php';
require_once 'unit-tests/class.csstidy_harness.php';
require_once 'unit-tests.inc';

// Test files
$test_files = array();
require 'unit-tests/_files.php';

// Setup test files
$test = new GroupTest('CSSTidy unit tests');
foreach ($test_files as $test_file) {
    require_once "unit-tests/$test_file";
    list($x, $class_suffix) = explode('.', $test_file);
    $test->addTestClass("csstidy_test_$class_suffix");
}

if (SimpleReporter::inCli()) $reporter = new TextReporter();
else $reporter = new csstidy_reporter('UTF-8');

$test->run($reporter);
