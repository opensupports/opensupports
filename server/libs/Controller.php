<?php
require_once 'libs/Validator.php';

abstract class Controller {

    /**
     * Instance-related stuff
    */
    abstract public function handler();
    abstract public function validations();

    public function getHandler() {
        return function () {
            try {
                $this->validate();
            } catch (ValidationException $exception) {
                Response::respondError($exception->getMessage());
                return;
            }

            $this->handler();
        };
    }
    
    public function validate() {
        $validator = new Validator();
        
        $validator->validate($this->validations());
    }

    public static function request($key) {
        $app = self::getAppInstance();

        return $app->request()->post($key);
    }
    
    public static function getLoggedUser() {
        return User::getUser((int)self::request('csrf_userid'));
    }

    public static function getAppInstance() {
        return \Slim\Slim::getInstance();
    }
}