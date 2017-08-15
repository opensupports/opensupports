<?php

class Setting extends DataStore {
    const TABLE = 'setting';

    public static function getSetting($name) {
        return parent::getDataStore($name, 'name');
    }

    public static function getProps() {
        return array(
            'name',
            'value',
            'permission'
        );
    }

    public static function getSMTPValues() {
        global $client;
        $smtpHost = Setting::getSetting('smtp-host')->getValue();

        if(Controller::isProductionEnv() && $smtpHost === 'DEFAULT') {
            return [
                'isDefault' => true,
                'smtp-host' => $client->getItem('smtp-host'),
                'smtp-port' => $client->getItem('smtp-port'),
                'smtp-user' => $client->getItem('smtp-user'),
                'smtp-pass' => $client->getItem('smtp-pass'),
                'no-reply-email' => $client->getItem('no-reply-email')
            ];
        } else {
            return [
                'isDefault' => false,
                'smtp-host' => $smtpHost,
                'smtp-port' => Setting::getSetting('smtp-port')->getValue(),
                'smtp-user' => Setting::getSetting('smtp-user')->getValue(),
                'smtp-pass' => Setting::getSetting('smtp-pass')->getValue(),
                'no-reply-email' => Setting::getSetting('no-reply-email')->getValue()
            ];
        }
    }

    public static function getCaptchaValues() {
        global $client;
        $reCaptchaPublicKey = Setting::getSetting('recaptcha-public')->getValue();

        if(Controller::isProductionEnv() && $reCaptchaPublicKey === 'DEFAULT') {
            $reCaptchaPublicKey = $client->getItem('recaptcha-public');
            $reCaptchaPrivateKey = $client->getItem('recaptcha-private');

            return [
                'isDefault' => true,
                'recaptcha-public' => ($reCaptchaPublicKey === 'NONE') ? '' : $reCaptchaPublicKey,
                'recaptcha-private' => ($reCaptchaPrivateKey === 'NONE') ? '' : $reCaptchaPrivateKey
            ];
        } else {
            return [
                'isDefault' => false,
                'recaptcha-public' => $reCaptchaPublicKey,
                'recaptcha-private' => Setting::getSetting('recaptcha-private')->getValue()
            ];
        }
    }

    public function getValue() {
        return $this->value;
    }
}