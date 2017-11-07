<?php

class Controller {
    public static $requestReturnMock = 'mockRequestValue';
    public static $checkUserLoggedReturnMock = true;
    public static $isUserSystemEnabledReturnMock = true;

    public static function request($value) {
        if($value === 'staff') return false;
        return static::$requestReturnMock;
    }

    public static function checkUserLogged() {
        return static::$checkUserLoggedReturnMock;
    }

    public static function isUserSystemEnabled() {
        return static::$isUserSystemEnabledReturnMock;
    }
}
