<?php
include_once 'tests/__mocks__/BeanMock.php';

class Setting extends \Mock {
    public static $functionList = array();

    public static function initStubs() {
        parent::setStatics(array(
            'getSetting' => parent::stub()->returns(self::getSettingInstanceMock()),
            'setSetting' => parent::stub()
        ));
    }

    public function isNull() {
        return false;
    }

    private static function getSettingInstanceMock() {
        $mockUserInstance = new BeanMock();

        $mockUserInstance->name = 'MOCK_SETTING_NAME';
        $mockUserInstance->value = 'MOCK_SETTING_VALUE';
        $mockUserInstance->getValue = \Mock::stub()->returns('MOCK_SETTING_VALUE');

        return $mockUserInstance;
    }
}
