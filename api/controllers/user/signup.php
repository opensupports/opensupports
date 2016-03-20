<?php

class SignUpController extends Controller {
    const PATH = '/signup';

    public function handler() {
        $email =  Controller::request('email');
        $password =  Controller::request('password');

        $userInstance = new User();
        $userInstance->setProperties(array(
            'email' => $email,
            'password' => $password,
            'admin' => 0
        ));
        $id = $userInstance->store();

        Response::respondSuccess(array(
            'id' => $id
        ));
    }
}
