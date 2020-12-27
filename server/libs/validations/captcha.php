<?php

namespace CustomValidations;

use Respect\Validation\Rules\AbstractRule;

class Captcha extends AbstractRule {
    private $dataStoreName;
    private $apiKeyPermissionType;

    public function __construct($apiKeyPermissionType = '') {
        $this->apiKeyPermissionType = $apiKeyPermissionType;
        if (in_array($apiKeyPermissionType, \APIKey::TYPES)) {
            $this->apiKeyType = $apiKeyPermissionType;
        } else if($apiKeyPermissionType) {
            throw new \Exception(\ERRORS::INVALID_API_KEY_TYPE);
        }
    }
    
    public function validate($reCaptchaResponse) {
        $reCaptchaPrivateKey = \Setting::getSetting('recaptcha-private')->getValue();
        $apiKey = \APIKey::getDataStore(\Controller::request('apiKey'), 'token');

        if (!$reCaptchaPrivateKey) return true;

        if (!$apiKey->isNull()){
            switch ($this->apiKeyPermissionType) {
                case 'TICKET_CREATE_PERMISSION':
                    return $apiKey->canCreateTickets;
                case 'USER_CREATE_PERMISSION': 
                    return $apiKey->canCreateUsers;
                case 'TICKET_CHECK_PERMISSION':
                    return $apiKey->canCheckTickets;
            }
        }

        $reCaptcha = new \ReCaptcha\ReCaptcha($reCaptchaPrivateKey);
        $reCaptchaValidation = $reCaptcha->verify($reCaptchaResponse, $_SERVER['REMOTE_ADDR']);
        return $reCaptchaValidation->isSuccess();
    }
}