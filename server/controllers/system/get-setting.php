<?php
use Respect\Validation\Validator as DataValidator;

class GetSettingController extends Controller {
    const PATH = '/get-setting';

    public function validations() {
        return [
            'permission' => 'any',
            'requestData' => [
                'name' => [
                    'validation' => DataValidator::length(4),
                    'error' => ERRORS::INVALID_SETTING
                ]
            ]
        ];
    }

    public function handler() {
        $setting = Setting::getSetting(Controller::request('name'));

        if (!$setting->isNull()) {
            Response::respondSuccess([
                'setting' => $setting->value
            ]);
        } else {
            Response::respondError(ERRORS::INVALID_SETTING);
        }
    }
}