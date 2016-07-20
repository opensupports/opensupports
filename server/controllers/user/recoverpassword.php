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

    public function handler(){
            $this->email = Controller::request('email');
            $this->token = Controller::request('token');
            $this->password = Controller::request('password');
        if ($this->email && $this->token) {
            $this->recoverPassword = RecoverPassword::getDatastore($this->token, 'token');

            if($this->recoverPassword){
                // TODO: borar item en base de datos
                $changePassword = User::getDataStore($this->email, 'email');

                $changePassword->password = $this->password;

                Response::respondSuccess('password changed');
            }
        }else {
            Response::respondError(ERRORS::NO_PERMISSION);
        }
    }
}