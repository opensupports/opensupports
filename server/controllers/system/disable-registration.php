<?php

class DisableRegistrationController extends Controller {
    const PATH = '/disable-registration';

    public function validations() {
        return [
            'permission' => 'staff_3',
            'requestData' => []
        ];
    }
    public function handler() {
        $password = Controller::request('password');

        if(!Hashing::verifyPassword($password, Controller::getLoggedUser()->password)) {
            Response::respondError(ERRORS::INVALID_PASSWORD);
            return;
        }

        $registrationRow = Setting::getSetting('registration');

        $registrationRow->value = false;
        $registrationRow->store();

        Response::respondSuccess();
    }
}