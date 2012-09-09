<?php

/**
 * Base test harness for CSSTidy, please make all tests inherit from this.
 */
class csstidy_harness extends UnitTestCase
{
    /**
     * Modified testing algorithm that allows a single test method to be
     * prefixed with __only in order to make it the only one run.
     */
    function getTests() {
        // __onlytest makes only one test get triggered
        foreach (get_class_methods(get_class($this)) as $method) {
            if (strtolower(substr($method, 0, 10)) == '__onlytest') {
                return array($method);
            }
        }
        return parent::getTests();
    }
}
