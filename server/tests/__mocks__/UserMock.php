<?php
class User extends \Mock {
    public static $functionList = array();

    public static function initStubs() {
        parent::setStatics(array(
            'authenticate' => parent::stub()->returns(self::getUserInstanceMock()),
            'getDataStore' => parent::stub()->returns(self::getUserInstanceMock())
        ));
    }

    public function isNull() {
        return false;
    }

    private static function getUserInstanceMock() {
        $mockUserInstance = new User();

        $mockUserInstance->id = 'MOCK_ID';
        $mockUserInstance->email = 'MOCK_EMAIL';
        $mockUserInstance->password = 'MOCK_PASSWORD';
        $mockUserInstance->disabled = 0;
        $mockUserInstance->lastLogin = '20180101';
        $mockUserInstance->verificationToken = null;

        return $mockUserInstance;
    }
}
