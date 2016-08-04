<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

class SendRecoverPasswordController extends Controller {
    const PATH = '/send-recover-password';

    public function validations() {
        return [
            'permission' => 'any',
            'requestData' => [
                'email' => [
                    'validation' => DataValidator::email()->userEmail(),
                    'error' => ERRORS::INVALID_EMAIL
                ]
            ]
        ];
    }

    public function handler() {
        $email = Controller::request('email');

        $token = Hashing::generateRandomToken();

        $recoverPassword = new RecoverPassword();
        $recoverPassword->setProperties(array(
            'email' => $email,
            'token' => $token
        ));
        $recoverPassword->store();

        Response::respondSuccess();
        //TODO:  mandar  mail con token
    }
}
