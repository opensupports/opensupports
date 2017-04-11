<?php
use Respect\Validation\Validator as DataValidator;

class EnableRegistrationController extends Controller {
    const PATH = '/enable-registration';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_3',
            'requestData' => []
        ];
    }

    public function handler() {
        $password = Controller::request('password');

        if(!Hashing::verifyPassword($password,Controller::getLoggedUser()->password)) {
            Response::respondError(ERRORS::INVALID_PASSWORD);
            return;
        }

        $registrationRow = Setting::getSetting('registration');

        $registrationRow->value = true;
        $registrationRow->store();

        Response::respondSuccess();
    }
}