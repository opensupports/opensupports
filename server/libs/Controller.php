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

            if (Controller::getAppInstance()->request()->isGet()) {
                $value = $app->request()->get($key);
            } else {
                $value = $app->request()->post($key);
            }

            return $value;
        };
    }

    public static function setDataRequester($dataRequester) {
        self::$dataRequester = $dataRequester;
    }

    public static function request($key, $secure = false) {
        $result = call_user_func(self::$dataRequester, $key);
        
        if($secure) {
            $config = HTMLPurifier_Config::createDefault();
            $purifier = new HTMLPurifier($config);
            return $purifier->purify($result);
        } else {
            return $result;
        }
    }
    
    public static function getLoggedUser() {
        $session = Session::getInstance();

        if ($session->isStaffLogged()) {
            return Staff::getUser($session->getUserId());
        } else {
            return User::getUser($session->getUserId());
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
    
    public function uploadFile($forceUpload = false) {
        $allowAttachments = Setting::getSetting('allow-attachments')->getValue();

        if(!isset($_FILES['file']) || (!$allowAttachments && !$forceUpload)) return '';

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
    
    public static function isUserSystemEnabled() {
        return Setting::getSetting('user-system-enabled')->getValue();
    }
}