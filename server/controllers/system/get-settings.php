<?php

/**
 * @api {post} /system/get-settings Retrieve settings.
 *
 * @apiName Get settings
 *
 * @apiGroup system
 *
 * @apiDescription This path retrieves one or more settings.
 *
 * @apiPermission any
 *
 * @apiParam {Boolean} allSettings A bool that means if you want a regular settings list or a complety settings list.
 *
 * @apiSuccess {Object} data Contains the information about the settings
 *
 */

class GetSettingsController extends Controller {
    const PATH = '/get-settings';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'any',
            'requestData' => []
        ];
    }

    public function handler() {
        $settingsList = [];

        if(InstallationDoneController::isInstallationDone()) {
            if(Controller::request('allSettings') && Controller::isStaffLogged(3)) {
                $settingsList = [
                    'language' => Setting::getSetting('language')->getValue(),
                    'reCaptchaKey' => Setting::getSetting('recaptcha-public')->getValue(),
                    'reCaptchaPrivate' => Setting::getSetting('recaptcha-private')->getValue(),
                    'time-zone' => Setting::getSetting('time-zone')->getValue(),
                    'maintenance-mode' => Setting::getSetting('maintenance-mode')->getValue() * 1,
                    'layout' => Setting::getSetting('layout')->getValue(),
                    'allow-attachments' => Setting::getSetting('allow-attachments')->getValue() * 1,
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
                    'maintenance-mode' => Setting::getSetting('maintenance-mode')->getValue() * 1,
                    'layout' => Setting::getSetting('layout')->getValue(),
                    'allow-attachments' => Setting::getSetting('allow-attachments')->getValue() * 1,
                    'max-size' => Setting::getSetting('max-size')->getValue(),
                    'title' => Setting::getSetting('title')->getValue(),
                    'registration' => Setting::getSetting('registration')->getValue(),
                    'departments' => Department::getDepartmentNames(),
                    'supportedLanguages' => Language::getSupportedLanguages(),
                    'allowedLanguages' => Language::getAllowedLanguages(),
                    'user-system-enabled' => Setting::getSetting('user-system-enabled')->getValue() * 1
                ];
            }
        }

        Response::respondSuccess($settingsList);
    }
}