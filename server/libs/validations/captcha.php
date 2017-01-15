<?php

namespace CustomValidations;

use Respect\Validation\Rules\AbstractRule;

class Captcha extends AbstractRule {

    public function validate($reCaptchaResponse) {
        $reCaptchaPrivateKey = \Setting::getSetting('recaptcha-private')->getValue();
        $apiKey = \APIKey::getDataStore(\Controller::request('apiKey'), 'token');

        if (!$reCaptchaPrivateKey || !$apiKey->isNull()) return true;

        $reCaptcha = new \ReCaptcha\ReCaptcha($reCaptchaPrivateKey);
        $reCaptchaValidation = $reCaptcha->verify($reCaptchaResponse, $_SERVER['REMOTE_ADDR']);

        return $reCaptchaValidation->isSuccess();
    }
}