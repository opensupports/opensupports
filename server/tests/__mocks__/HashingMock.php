<?php

class Session extends \Mock {
    public static $functionList = array();

    public static function initStubs() {
        self::setStatics(array(
            'hashPassword' => parent::stub()->returns('HASHED_PASSword'),
            'verifyPassword' => parent::stub()->returns(true),
            'generateRandomToken' => parent::stub()->returns('TEST_TOKEN')
        ));
    }

    public static function mockInstanceFunction($functionName, $functionMock) {
        self::getInstance()->{$functionName} = $functionMock;
    }

    private static function getInstanceMock() {
        return new \Mock(array(
            'initSession' => parent::stub(),
            'closeSession' => parent::stub(),
            'createSession' => parent::stub(),
            'getToken' => parent::stub()->returns('TEST_TOKEN'),
            'sessionExists' => parent::stub()->returns(false),
            'checkAuthentication' => parent::stub()->returns(true),
            'isLoggedWithId' => parent::stub()->returns(true),
        ));
    }
}