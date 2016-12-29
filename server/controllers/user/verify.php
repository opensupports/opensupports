<?php
use Respect\Validation\Validator as DataValidator;

class VerifyController extends Controller{
    const PATH = '/verify';

    public function validations() {
        return [
            'permission' => 'any',
            'requestData' => [
                'email' => [
                    'validation' => DataValidator::email(),
                    'error' => ERRORS::INVALID_EMAIL
                ]
            ]
        ];
    }

    public function handler() {
        $email = Controller::request('email');
        $token = Controller::request('token');

        $userRow = User::getDataStore($email, 'email');

        if(!$userRow) {
            Response::respondError(ERRORS::INVALID_EMAIL);
            return;
        }
        if($userRow->verificationToken !== $token) {
            Response::respondError(ERRORS::INVALID_TOKEN);
            return;
        }
        $userRow->verificationToken = null;
        $userRow->store();
        
        Response::respondSuccess();
    }
}