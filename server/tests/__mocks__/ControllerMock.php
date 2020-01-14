<?php

class Controller {
    const USE_VALUE_RETURN = 'sadf64a5s6d1f5sa';
    public static $requestReturnMock = null;
    public static $checkUserLoggedReturnMock = true;
    public static $isUserSystemEnabledReturnMock = true;

    public static function useValueReturn() {
        static::$requestReturnMock = self::USE_VALUE_RETURN;
    }

    public static function request($value) {
        if($value === 'staff') return false;
        if(static::$requestReturnMock !== self::USE_VALUE_RETURN) return static::$requestReturnMock;
        return $value . '_REQUEST_RESULT';
    }

    public static function checkUserLogged() {
        return static::$checkUserLoggedReturnMock;
    }

    public static function isUserSystemEnabled() {
        return static::$isUserSystemEnabledReturnMock;
    }
}
