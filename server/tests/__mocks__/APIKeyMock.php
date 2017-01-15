<?php
include_once 'tests/__mocks__/NullDataStoreMock.php';

class APIKey extends \Mock {
    public static $functionList = array();

    public static function initStubs() {
        parent::setStatics(array(
            'getDataStore' => parent::stub()->returns(new NullDataStore()),
        ));
    }
}