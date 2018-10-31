<?php
require_once 'libs/Validator.php';
require_once 'models/Session.php';

use RedBeanPHP\Facade as RedBean;

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
                if(RedBean::testConnection() && !Setting::isTableEmpty()) {
                    Session::getInstance()->setSessionPrefix(Setting::getSetting('session-prefix')->getValue());
                }
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

        if($key === 'email' || $key === 'newEmail') {
            return strtolower($result);
        }

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

    public static function isProductionEnv() {
        return getenv('ENV') != 'test';
    }

    public static function getAppInstance() {
        return \Slim\Slim::getInstance();
    }

    public function uploadImages($forceUpload = false) {
        $allowAttachments = Setting::getSetting('allow-attachments')->getValue();
        $totalImages = Controller::request('images') * 1;

        if(!$allowAttachments && !$forceUpload) return [];
        if(!$totalImages) return [];

        $maxSize = Setting::getSetting('max-size')->getValue();
        $fileGap = Setting::getSetting('file-gap')->getValue();
        $fileFirst = Setting::getSetting('file-first-number')->getValue();
        $fileQuantity = Setting::getSetting('file-quantity');

        $fileUploader = FileUploader::getInstance();
        $fileUploader->setMaxSize($maxSize);

        $allImagesValidSize = true;

        for($i=0;$i<$totalImages;$i++) {
            $allImagesValidSize = $allImagesValidSize && $fileUploader->isSizeValid($_FILES["image_$i"]);
        }

        if(!$allImagesValidSize) throw new Exception(ERRORS::INVALID_FILE);

        $imagePaths = [];
        $url = Setting::getSetting('url')->getValue();
        for($i=0;$i<$totalImages;$i++) {
            $fileUploader->setGeneratorValues($fileGap, $fileFirst, $fileQuantity->getValue());
            $fileUploader->upload("image_$i");
            $imagePaths[] = $url . '/api/system/download?file=' . $fileUploader->getFileName();
            $fileQuantity->value++;
        }

        $fileQuantity->store();
        return $imagePaths;
    }

    public function uploadFile($forceUpload = false) {
        $allowAttachments = Setting::getSetting('allow-attachments')->getValue();

        if(!$allowAttachments && !$forceUpload) return '';
        if(!isset($_FILES['file'])) return '';

        $maxSize = Setting::getSetting('max-size')->getValue();
        $fileGap = Setting::getSetting('file-gap')->getValue();
        $fileFirst = Setting::getSetting('file-first-number')->getValue();
        $fileQuantity = Setting::getSetting('file-quantity');

        $fileUploader = FileUploader::getInstance();
        $fileUploader->setMaxSize($maxSize);
        $fileUploader->setGeneratorValues($fileGap, $fileFirst, $fileQuantity->getValue());

        if($fileUploader->upload('file')) {
            $fileQuantity->value++;
            $fileQuantity->store();

            return $fileUploader;
        } else {
            throw new Exception(ERRORS::INVALID_FILE);
        }
    }

    public function replaceWithImagePaths($imagePaths, $content) {
        if(!is_array($imagePaths)) return $content;
        return str_replace(array_map(function($index) { return "IMAGE_PATH_$index"; }, array_keys($imagePaths)), $imagePaths, $content);
    }

    public static function isUserSystemEnabled() {
        return Setting::getSetting('user-system-enabled')->getValue();
    }
}
