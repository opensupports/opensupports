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
            'manteniance-mode',
            'system-title',
            'timezone',
            'layout',
            'smtp-server',
            'smtp-email',
            'smtp-password',
            'smtp-port',
            'default-language',
            'recaptcha-public',
            'recaptcha-private',
            'allow-attachments',
            'max-size'
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