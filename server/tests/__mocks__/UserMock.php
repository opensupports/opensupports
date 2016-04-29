<?php
class User extends \Mock {
    public static $functionList = array();

    public static function initStubs() {
        parent::setStatics(array(
            'authenticate' => parent::stub()->returns(self::getUserInstanceMock()),
        ));
    }

    private static function getUserInstanceMock() {
        $mockUserInstance = new \stdClass();

        $mockUserInstance->id = 'MOCK_ID';
        $mockUserInstance->email = 'MOCK_EMAIL';
        $mockUserInstance->password = 'MOCK_PASSWORD';

        return $mockUserInstance;
    }
}