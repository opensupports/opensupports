<?php
use RedBeanPHP\Facade as RedBean;

use Respect\Validation\Validator as DataValidator;

class SignUpController extends Controller {
    const PATH = '/signup';

    public function validations() {
        return [
            'permission' => 'any',
            'requestData' => [
                'name' => [
                    'validation' => DataValidator::length(2, 50),
                    'error' => ERRORS::INVALID_NAME
                ],
                'email' => [
                    'validation' => DataValidator::contains('@'),
                    'error' => ERRORS::INVALID_EMAIL
                ],
                'password' => [
                    'validation' => DataValidator::length(5, 20),
                    'error' => ERRORS::INVALID_PASSWORD
                ]
            ]
        ];
    }

    public function handler() {
        $email =  Controller::request('email');
        $password =  Controller::request('password');

        $userId = $this->createNewUserAndRetrieveId($email, $password);

        Response::respondSuccess(array(
            'userId' => $userId,
            'userEmail' => $email
        ));
    }

    public function createNewUserAndRetrieveId($email, $password) {
        $userInstance = new User();
        $userInstance->setProperties(array(
            'email' => $email,
            'password' => Hashing::hashPassword($password)
        ));

        return $userInstance->store();
    }
}
