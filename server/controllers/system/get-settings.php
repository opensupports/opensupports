<?php

/**
 * @api {post} /system/get-settings Get settings
 * @apiVersion 4.3.2
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
        $captchaValues = Setting::getCaptchaValues();
        $smtpValues = Setting::getSMTPValues();

        if(InstallationDoneController::isInstallationDone()) {
            if(Controller::request('allSettings') && Controller::isStaffLogged(3)) {
                $settingsList = [
                    'staffLimit' => $this->staffOverLimit,
                    'language' => Setting::getSetting('language')->getValue(),
                    'reCaptchaKey' => ($captchaValues['isDefault']) ? 'DEFAULT' : $captchaValues['recaptcha-public'],
                    'reCaptchaPrivate' => ($captchaValues['isDefault']) ? 'DEFAULT' : $captchaValues['recaptcha-private'],
                    'time-zone' => Setting::getSetting('time-zone')->getValue(),
                    'maintenance-mode' => intval(Setting::getSetting('maintenance-mode')->getValue()),
                    'layout' => Setting::getSetting('layout')->getValue(),
                    'allow-attachments' => intval(Setting::getSetting('allow-attachments')->getValue()),
                    'max-size' => Setting::getSetting('max-size')->getValue(),
                    'url' => Setting::getSetting('url')->getValue(),
                    'title' => Setting::getSetting('title')->getValue(),
                    'smtp-host' => ($smtpValues['isDefault']) ? 'DEFAULT' : $smtpValues['smtp-host'],
                    'smtp-port' => ($smtpValues['isDefault']) ? 'DEFAULT' : $smtpValues['smtp-port'],
                    'smtp-user' => ($smtpValues['isDefault']) ? 'DEFAULT' : $smtpValues['smtp-user'],
                    'no-reply-email' => ($smtpValues['isDefault']) ? 'DEFAULT' : $smtpValues['no-reply-email'],
                    'registration' => Setting::getSetting('registration')->getValue(),
                    'departments' => Department::getAllDepartmentNames(),
                    'supportedLanguages' => Language::getSupportedLanguages(),
                    'allowedLanguages' => Language::getAllowedLanguages(),
                    'session-prefix' => Setting::getSetting('session-prefix')->getValue(),
                    'mail-template-header-image' => Setting::getSetting('mail-template-header-image')->getValue(),
                ];
            } else {
                $settingsList = [
                    'staffLimit' => $this->staffOverLimit,
                    'reCaptchaKey' => ($captchaValues['recaptcha-public'] !== 'NONE') ? $captchaValues['recaptcha-public'] : '',
                    'language' => Setting::getSetting('language')->getValue(),
                    'time-zone' => Setting::getSetting('time-zone')->getValue(),
                    'maintenance-mode' => intval(Setting::getSetting('maintenance-mode')->getValue()),
                    'layout' => Setting::getSetting('layout')->getValue(),
                    'allow-attachments' => intval(Setting::getSetting('allow-attachments')->getValue()),
                    'max-size' => Setting::getSetting('max-size')->getValue(),
                    'title' => Setting::getSetting('title')->getValue(),
                    'registration' => Setting::getSetting('registration')->getValue(),
                    'departments' => Controller::isStaffLogged() ? Department::getAllDepartmentNames() : Department::getPublicDepartmentNames(),
                    'supportedLanguages' => Language::getSupportedLanguages(),
                    'allowedLanguages' => Language::getAllowedLanguages(),
                    'user-system-enabled' => intval(Setting::getSetting('user-system-enabled')->getValue()),
                    'session-prefix' => Setting::getSetting('session-prefix')->getValue(),
                ];
            }
        }

        Response::respondSuccess($settingsList);
    }
}
