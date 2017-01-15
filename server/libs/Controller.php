<?php
require_once 'libs/Validator.php';
require_once 'models/Session.php';

abstract class Controller {
    private static $dataRequester;

    /**
     * Instance-related stuff
    */
    abstract public function handler();
    abstract public function validations();

    public function getHandler() {
        return function () {
            try {
                $this->validate();
                $this->handler();
            } catch (\Exception $exception) {
                Response::respondError($exception->getMessage());
                return;
            }
        };
    }
    
    public function validate() {
        $validator = new Validator();
        
        $validator->validate($this->validations());
    }

    public static function init() {
        self::$dataRequester = function ($key) {
            $app = self::getAppInstance();

            return $app->request()->post($key);
        };
    }

    public static function setDataRequester($dataRequester) {
        self::$dataRequester = $dataRequester;
    }

    public static function request($key) {
        return call_user_func(self::$dataRequester, $key);
    }
    
    public static function getLoggedUser() {
        $session = Session::getInstance();

        if ($session->isStaffLogged()) {
            return Staff::getUser((int)self::request('csrf_userid'));
        } else {
            return User::getUser((int)self::request('csrf_userid'));
        }
    }

    public static function isUserLogged() {
        $session = Session::getInstance();

        return $session->checkAuthentication(array(
            'userId' => Controller::request('csrf_userid'),
            'token' => Controller::request('csrf_token')
        ));
    }

    public static function isStaffLogged($level = 1) {
        return Controller::isUserLogged() && (Controller::getLoggedUser()->level >= $level);
    }

    public static function getAppInstance() {
        return \Slim\Slim::getInstance();
    }
    
    public function uploadFile() {
        if(!isset($_FILES['file'])) return '';

        $maxSize = Setting::getSetting('max-size')->getValue();
        $fileGap = Setting::getSetting('file-gap')->getValue();
        $fileFirst = Setting::getSetting('file-first-number')->getValue();
        $fileQuantity = Setting::getSetting('file-quantity');

        $fileUploader = FileUploader::getInstance();
        $fileUploader->setMaxSize($maxSize);
        $fileUploader->setGeneratorValues($fileGap, $fileFirst, $fileQuantity->getValue());

        if($fileUploader->upload($_FILES['file'])) {
            $fileQuantity->value++;
            $fileQuantity->store();

            return $fileUploader;
        } else {
            throw new Exception(ERRORS::INVALID_FILE);
        }
    }
}