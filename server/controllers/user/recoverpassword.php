<?php

class RecoverPasswordController extends Controller {
    const PATH = '/recoverpassword';

    private $email;
    private $token;
    private $password;
    private $recoverPassword;

    public function validations() {
        return [
            'permission' => 'any',
            'requestData' => []
        ];
    }

    public function handler() {
        $this->email = Controller::request('email');
        $this->token = Controller::request('token');
        $this->password = Controller::request('password');

        if($this->email && $this->token === null ) {
            $this->token = Hashing::generateRandomToken();

            $this->recoverPassword = new RecoverPassword();

            $this->recoverPassword->setProperties(array(
                'email' => $this->email,
                'token' => $this->token
            ));

            $this->recoverPassword->store();
            Response::respondSuccess($this->token);
            /*mandar  mail con token*/

        } else if ($this->email && $this->token) {
            if($this->recoverPassword->token === $this->token){
                /*borrar base de datos */
                $changePassword = User::getDataStore($this->email, 'email');

                $changePassword->password = $this->password;

                Response::respondSuccess($changePassword->password);
            }

        } else {
            Response::respondError(ERRORS::INVALID_CREDENTIALS);
        }
    }
}