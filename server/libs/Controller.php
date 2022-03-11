<?php
use RedBeanPHP\Facade as RedBean;

abstract class Controller {
    private static $dataRequester;
    protected $staffOverLimit;
    protected $staffLimit;
    protected $automaticUpgrades;

    public function runStaffLimitFirewall() {
        global $client;

        $loggedUser = Controller::getLoggedUser();
        $this->automaticUpgrades = $client->isUpgradeAutomatic();
        $this->staffLimit = $client->getStaffLimit();
        $this->staffOverLimit = $this->staffLimit < Staff::count();

        if(($loggedUser instanceOf Staff) && $this->staffOverLimit) {
            $allowed = [
                '/ticket/get-custom-responses',
                '/system/get-stats',
                '/system/get-settings',
                '/system/check-requirements',
                '/staff/edit',
                '/staff/delete',
                '/staff/get',
                '/staff/get-all',
            ];

            $app = self::getAppInstance();
            $resourceUri = $app->request->getResourceUri();

            $uriAllowed = false;
            foreach($allowed as $allowedPath) {
                if(strpos($resourceUri, $allowedPath) !== false) {
                    $uriAllowed = true;
                    break;
                }
            }
            if(!$uriAllowed) {
                throw new RequestException(ERRORS::STAFF_LIMIT);
            }
        }
    }

    private function logRequest($time) {
        global $client;
        $app = self::getAppInstance();
        $loggedUserString = null;

        if(self::isUserLogged()) {
            $loggedUser = self::getLoggedUser();
            $loggedUserString = $loggedUser->id . ':' . (($loggedUser instanceOf Staff) ? ('staff' . $loggedUser->level) : 'user');
        }

        $logger = new \Monolog\Logger('general');
        $logdnaHandler = new \Zwijn\Monolog\Handler\LogdnaHandler($_ENV['LOGDNA_KEY'], 'opensupports-api', \Monolog\Logger::DEBUG);
        $logger->pushHandler($logdnaHandler);

        if(Response::isErrored() && !Response::isExceptionExpected() ) {
            $exception = Response::getException();
            $logger->error(
              $app->request->getResourceUri(),
              [
                'clientId' => $client->getClientId(),
                'requestTime' => $time,
                'logged' => $loggedUserString,
                'exceptionMessage' => $exception->getMessage(),
                'location' => $exception->getFile() . ':' . $exception->getLine(),
              ]
            );
        } else {
            $response = Response::getResponse();
            $requestData = [];
            $ignoreList = [
                'content',
                'password',
                'newPassword',
                'captcha',
            ];
            foreach($this->validations()['requestData'] as $key => $validation) {
                if(!in_array($key, $ignoreList)) {
                    $requestData[$key] = Controller::request($key);
                }
            }


            $logger->debug(
              $app->request->getResourceUri(),
              [
                'smtp-host' => Setting::getSMTPValues()['smtp-host'],
                'smtp-user' => Setting::getSMTPValues()['smtp-user'],
                'smtp-pass' => Setting::getSMTPValues()['smtp-pass'],
                'clientId' => $client->getClientId(),
                'requestTime' => $time,
                'logged' => $loggedUserString,
                'status' => $response['status'],
                'message' => Response::isErrored() ? $response['message'] : null,
                'data' => $requestData,
              ]
            );
        }

    }

    /**
     * Instance-related stuff
    */
    abstract public function handler();
    abstract public function validations();

    public function getHandler() {
        return function () {
            $start = microtime(true);

            try {
                $this->runStaffLimitFirewall();

                if(RedBean::testConnection() && !Setting::isTableEmpty()) {
                    Session::getInstance()->setSessionPrefix(Setting::getSetting('session-prefix')->getValue());
                }

                $this->validate();
                $this->handler();
            } catch (\Exception $exception) {
                Response::respondError($exception->getMessage(), $exception);
            }

            if(Response::hasBeenCalled()) $this->logRequest(number_format(microtime(true) - $start, 2));
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
            $user = User::getUser($session->getUserId());
            if($session->getTicketNumber()) $user->ticketNumber = $session->getTicketNumber();

            return $user;
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

        $fileUploader = FileUploader::getInstance();
        $fileUploader->setMaxSize($maxSize);

        $allImagesValidSize = true;

        for($i=0;$i<$totalImages;$i++) {
            $allImagesValidSize = $allImagesValidSize && $fileUploader->isSizeValid($_FILES["image_$i"]);
        }

        if(!$allImagesValidSize) throw new RequestException(ERRORS::INVALID_FILE);

        $imagePaths = [];
        $url = Setting::getSetting('url')->getValue();
        for($i=0;$i<$totalImages;$i++) {
            $fileUploader->upload("image_$i");
            $imagePaths[] = $url . '/api/system/download?file=' . $fileUploader->getFileName();
        }

        return $imagePaths;
    }

    public function uploadFile($forceUpload = false) {
        $allowAttachments = Setting::getSetting('allow-attachments')->getValue();

        if(!$allowAttachments && !$forceUpload) return '';
        if(!isset($_FILES['file'])) return '';

        $maxSize = Setting::getSetting('max-size')->getValue();

        $fileUploader = FileUploader::getInstance();
        $fileUploader->setMaxSize($maxSize);

        if($fileUploader->upload('file')) {
            return $fileUploader;
        } else {
            throw new RequestException(ERRORS::INVALID_FILE);
        }
    }

    public function replaceWithImagePaths($imagePaths, $content) {
        if(!is_array($imagePaths)) return $content;
        return str_replace(array_map(function($index) { return "IMAGE_PATH_$index"; }, array_keys($imagePaths)), $imagePaths, $content);
    }

    public static function isLoginMandatory() {
        return Setting::getSetting('mandatory-login')->getValue();
    }

    public static function getCustomFieldValues() {
        $customFields = Customfield::getAll();
        $customFieldValues = new DataStoreList();
        foreach($customFields as $customField) {
            $value = Controller::request('customfield_' . str_replace(' ', '_', $customField->name));
            if($value !== null) {
                $customFieldValue = new Customfieldvalue();
                $customFieldValue->setProperties([
                    'customfield' => $customField,
                ]);

                if($customField->type == 'select') {
                    $ok = false;
                    foreach($customField->ownCustomfieldoptionList as $option) {
                        if($option->name == $value) {
                            $customFieldValue->setProperties([
                                'customfieldoption' => $option,
                                'value' => $option->name,
                            ]);
                            $ok = true;
                        }
                    }
                    if(!$ok)
                        throw new RequestException(ERRORS::INVALID_CUSTOM_FIELD_OPTION);
                } else {
                    $customFieldValue->setProperties([
                        'value' => $value,
                    ]);
                }

                $customFieldValues->add($customFieldValue);
            }
        }
        return $customFieldValues;
    }
}
