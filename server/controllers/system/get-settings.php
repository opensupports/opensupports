<?php

class GetSettingsController extends Controller {
    const PATH = '/get-settings';

    public function validations() {
        return [
            'permission' => 'any',
            'requestData' => []
        ];
    }

    public function handler() {

        if(Controller::request('allSettings') && Controller::isStaffLogged(3)) {
            $settingsList = [
                'language' => Setting::getSetting('language')->getValue(),
                'reCaptchaKey' => Setting::getSetting('recaptcha-public')->getValue(),
                'reCaptchaPrivate' => Setting::getSetting('recaptcha-private')->getValue(),
                'time-zone' => Setting::getSetting('time-zone')->getValue(),
                'maintenance-mode' => Setting::getSetting('maintenance-mode')->getValue(),
                'layout' => Setting::getSetting('layout')->getValue(),
                'allow-attachments' => Setting::getSetting('allow-attachments')->getValue(),
                'max-size' => Setting::getSetting('max-size')->getValue(),
                'url' => Setting::getSetting('url')->getValue(),
                'title' => Setting::getSetting('title')->getValue(),
                'no-reply-email' => Setting::getSetting('no-reply-email')->getValue(),
                'smtp-port' => Setting::getSetting('smtp-port')->getValue(),
                'smtp-host' => Setting::getSetting('smtp-host')->getValue(),
                'smtp-user' => Setting::getSetting('smtp-user')->getValue(),
                'registration' => Setting::getSetting('registration')->getValue(),
                'departments' => Department::getDepartmentNames(),
                'supportedLanguages' => Language::getSupportedLanguages(),
                'allowedLanguages' => Language::getAllowedLanguages()
            ];
        } else {
            $settingsList = [
                'language' => Setting::getSetting('language')->getValue(),
                'reCaptchaKey' => Setting::getSetting('recaptcha-public')->getValue(),
                'time-zone' => Setting::getSetting('time-zone')->getValue(),
                'maintenance-mode' => Setting::getSetting('maintenance-mode')->getValue(),
                'layout' => Setting::getSetting('layout')->getValue(),
                'allow-attachments' => Setting::getSetting('allow-attachments')->getValue(),
                'max-size' => Setting::getSetting('max-size')->getValue(),
                'title' => Setting::getSetting('title')->getValue(),
                'registration' => Setting::getSetting('registration')->getValue(),
                'departments' => Department::getDepartmentNames(),
                'supportedLanguages' => Language::getSupportedLanguages(),
                'allowedLanguages' => Language::getAllowedLanguages(),
                'user-system-enabled' => Setting::getSetting('user-system-enabled')->getValue()
            ];
        }

        Response::respondSuccess($settingsList);
    }
}