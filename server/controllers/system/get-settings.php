<?php

/**
 * @api {post} /system/get-settings Get settings
 * @apiVersion 4.2.0
 *
 * @apiName Get settings
 *
 * @apiGroup System
 *
 * @apiDescription This path retrieves all the settings.
 *
 * @apiPermission any
 *
 * @apiParam {Boolean} allSettings Indicates if you want the regular settings list or a complete settings list. Complete list only available for staff level3.
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
                    'maintenance-mode' => intval(Setting::getSetting('maintenance-mode')->getValue()),
                    'layout' => Setting::getSetting('layout')->getValue(),
                    'allow-attachments' => intval(Setting::getSetting('allow-attachments')->getValue()),
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
                    'allowedLanguages' => Language::getAllowedLanguages(),
                    'session-prefix' => Setting::getSetting('session-prefix')
                ];
            } else {
                $settingsList = [
                    'language' => Setting::getSetting('language')->getValue(),
                    'reCaptchaKey' => Setting::getSetting('recaptcha-public')->getValue(),
                    'time-zone' => Setting::getSetting('time-zone')->getValue(),
                    'maintenance-mode' => intval(Setting::getSetting('maintenance-mode')->getValue()),
                    'layout' => Setting::getSetting('layout')->getValue(),
                    'allow-attachments' => intval(Setting::getSetting('allow-attachments')->getValue()),
                    'max-size' => Setting::getSetting('max-size')->getValue(),
                    'title' => Setting::getSetting('title')->getValue(),
                    'registration' => Setting::getSetting('registration')->getValue(),
                    'departments' => Department::getDepartmentNames(),
                    'supportedLanguages' => Language::getSupportedLanguages(),
                    'allowedLanguages' => Language::getAllowedLanguages(),
                    'user-system-enabled' => intval(Setting::getSetting('user-system-enabled')->getValue()),
                    'session-prefix' => Setting::getSetting('session-prefix')
                ];
            }
        }

        Response::respondSuccess($settingsList);
    }
}
