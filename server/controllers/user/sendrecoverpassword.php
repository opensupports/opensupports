<?php

class SendRecoverPasswordController extends Controller {
    const PATH = '/sendrecoverpassword';

    private $email;
    private $token;

    public function validations() {
        return [
            'permission' => 'any',
            'requestData' => []
        ];
    }

    public function handler() {
        $this->email = Controller::request('email');

        if($this->email) {
            $this->token = Hashing::generateRandomToken();

            $recoverPassword = new RecoverPassword();

            $recoverPassword->setProperties(array(
                'email' => $this->email,
                'token' => $this->token
            ));

            $recoverPassword->store();
            Response::respondSuccess();
            //TODO:  mandar  mail con token

        }
    }
}