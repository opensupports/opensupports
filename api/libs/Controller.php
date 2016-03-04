<?php

abstract class Controller {

    /**
     * Instance-related stuff
    */
    abstract public function handler();

    public function getHandler() {
        return function () {
            $this->handler();
        };
    }

    public static function request($key) {
        $app = self::getAppInstance();

        return $app->request()->post($key);
    }

    public static function checkUserLogged() {
        $session = Session::getInstance();

        return $session->checkAuthentication(array(
            'user_id' => self::request('csrf_userid'),
            'token' => self::request('csrf_token')
        ));
    }

    public static function getLoggedUser() {
        return User::getUser((int)self::request('csrf_userid'));
    }

    public static function checkStaffLogged() {
        return self::checkUserLogged() && (self::getLoggedUser()->admin === 1);
    }

    public static function checkAdminLogged() {
        return self::checkUserLogged() && (self::getLoggedUser()->admin === 2);
    }

    public static function getAppInstance() {
        return \Slim\Slim::getInstance();
    }
}