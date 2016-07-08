<?php

class SignUpController extends Controller {
    const PATH = '/signup';

    private $email;
    private $password;

    public function handler() {
        $this->requestUserData();

        $userId = $this->createNewUserAndRetrieveId($this->email, $this->password);

        Response::respondSuccess(array(
            'userId' => $userId,
            'userEmail' => $this->email
        ));

        EmailSender::validRegister($this->email);
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
