<?php

namespace CustomValidations;

use Respect\Validation\Rules\AbstractRule;

class Captcha extends AbstractRule {
    private $dataStoreName;

    public function __construct($apiKeyType = '') {
        if (in_array($apiKeyType, \APIKey::TYPES)) {
            $this->apiKeyType = $apiKeyType;
        } else if($apiKeyType) {
            throw new \Exception(\ERRORS::INVALID_API_KEY_TYPE);
        }
    }

    public function validate($reCaptchaResponse) {
        $reCaptchaPrivateKey = \Setting::getSetting('recaptcha-private')->getValue();
        $apiKey = \APIKey::getDataStore(\Controller::request('apiKey'), 'token');

        if (!$reCaptchaPrivateKey) return true;
        if (!$apiKey->isNull() && $apiKey->type === $apiKeyType) return true;

        $reCaptcha = new \ReCaptcha\ReCaptcha($reCaptchaPrivateKey);
        $reCaptchaValidation = $reCaptcha->verify($reCaptchaResponse, $_SERVER['REMOTE_ADDR']);

        return $reCaptchaValidation->isSuccess();
    }
}