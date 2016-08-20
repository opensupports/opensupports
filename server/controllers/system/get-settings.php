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
        Response::respondSuccess([
            'language' => Setting::getSetting('language')->getValue(),
            'reCaptchaKey' => Setting::getSetting('recaptcha-public')->getValue(),
            'departments' => Department::getDepartmentNames()
        ]);
    }
}