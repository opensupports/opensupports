<?php
use Respect\Validation\Validator as DataValidator;

class RecoverPasswordController extends Controller {
    const PATH = '/recoverpassword';

    private $email;
    private $token;
    private $password;
    private $recoverPassword;

    public function validations() {
        return [
            'permission' => 'any',
            'requestData' => [
                'email' => [
                    'validation' => DataValidator::email() ,
                    'error' => ERRORS::INVALID_EMAIL
                ],
                'password' => [
                    'validation' => DataValidator::length(5, 200),
                    'error' => ERRORS::INVALID_PASSWORD
                ]
            ]
        ];
    }

    public function handler(){
        $this->requestData();
        $this->changePassword();
    }

    public function requestData(){
        $this->email = Controller::request('email');
        $this->token = Controller::request('token');
        $this->password = Controller::request('password');
    }
    public function changePassword(){
        if ($this->email && $this->token) {
            $this->recoverPassword = RecoverPassword::getDatastore($this->token, 'token');

            if($this->recoverPassword) {
                $user = User::getDataStore($this->email, 'email');

                if ($user) {
                    $this->recoverPassword->trash();

                    $user->setProperties([
                        'password' => Hashing::hashPassword($this->password)
                    ]);

                    $user->store();
                    Response::respondSuccess('password changed');
                    return;
                }
            }
        }

        Response::respondError(ERRORS::NO_PERMISSION);
    }
}
