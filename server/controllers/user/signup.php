<?php

class SignUpController extends Controller {
    const PATH = '/signup';

    private $email;
    private $password;

    public function handler() {
        $this->requestUserData();

        $userId = $this->createNewUserAndRetrieveId($email, $password);

        Response::respondSuccess(array(
            'userId' => $userId,
            'userEmail' => $email
        ));

        EmailSender::validRegister($email);
    }
    public function requestUserData(){
        $this->email =  Controller::request('email');
        $this->password =  Controller::request('password');
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
