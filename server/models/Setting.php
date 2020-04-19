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
                'smtp-user' => $client->getItem('smtp-user'),
                'smtp-pass' => $client->getItem('smtp-pass'),
                'server-email' => $client->getClientEmail()
            ];
        } else {
            return [
                'isDefault' => false,
                'smtp-host' => $smtpHost,
                'smtp-user' => Setting::getSetting('smtp-user')->getValue(),
                'smtp-pass' => Setting::getSetting('smtp-pass')->getValue(),
                'server-email' => Setting::getSetting('server-email')->getValue()
            ];
        }
    }

    public static function getIMAPValues() {
        global $client;
        $imapHost = Setting::getSetting('imap-host')->getValue();

        if(Controller::isProductionEnv() && $imapHost === 'DEFAULT') {
            return [
                'isDefault' => true,
                'imap-host' => '',
                'imap-port' => '',
                'imap-user' => '',
                'imap-pass' => '',
                'imap-token' => '',
            ];
        } else {
            return [
                'isDefault' => false,
                'imap-host' => $imapHost,
                'imap-port' => Setting::getSetting('imap-port')->getValue(),
                'imap-user' => Setting::getSetting('imap-user')->getValue(),
                'imap-pass' => Setting::getSetting('imap-pass')->getValue(),
                'imap-token' => Setting::getSetting('imap-token')->getValue(),
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
