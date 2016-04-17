<?php

class SignUpController extends Controller {
    const PATH = '/signup';

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
            'password' => User::hashPassword($password),
            'admin' => 0
        ));

        return $userInstance->store();
    }
}
