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
            'time-zone' => Setting::getSetting('time-zone')->getValue(),
            'maintenance-mode' => Setting::getSetting('maintenance-mode')->getValue(),
            'layout' => Setting::getSetting('layout')->getValue(),
            'allow-attachments' => Setting::getSetting('allow-attachments')->getValue(),
            'max-size' => Setting::getSetting('max-size')->getValue(),
            'departments' => Department::getDepartmentNames()
        ]);
    }
}