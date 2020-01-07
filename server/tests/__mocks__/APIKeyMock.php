<?php
include_once 'tests/__mocks__/NullDataStoreMock.php';

class APIKey extends \Mock {
    const REGISTRATION = 'REGISTRATION';
    const TICKET_CREATE = 'TICKET_CREATE';
    const TYPES = [APIKey::REGISTRATION, APIKey::TICKET_CREATE];

    public static $functionList = array();

    public static function initStubs() {
        parent::setStatics(array(
            'getDataStore' => parent::stub()->returns(new NullDataStore()),
        ));
    }
}