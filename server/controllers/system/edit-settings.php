<?php
use Respect\Validation\Validator as DataValidator;

class EditSettingsController extends Controller {
    const PATH = '/edit-settings';

    public function validations() {
        return [
            'permission' => 'staff_3',
            'requestData' => []
        ];
    }

    public function handler() {
        $settings = [
            'language',
            'recaptcha-public',
            'recaptcha-private',
            'no-reply-email',
            'smtp-host',
            'smtp-port',
            'smtp-user',
            'smtp-pass',
            'time-zone',
            'maintenance-mode',
            'layout',
            'allow-attachments',
            'max-size',
            'system-title'
        ];

        foreach($settings as $setting) {
            if(Controller::request($setting)) {
                $settingInstance = Setting::getSetting($setting);
                $settingInstance->value = Controller::request($setting);
                $settingInstance->store();
            }
        }
        Response::respondSuccess();
    }
}