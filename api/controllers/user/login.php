<?php

class LoginController extends Controller {
    const PATH = '/login';

    public function handler() {
        $session = Session::getInstance();

        $email =  Controller::request('email');
        $password =  Controller::request('password');

        if ($session->sessionExists()) {
            Response::respondError(ERRORS::SESSION_EXISTS);
            return;
        }

        $userInstance = User::getUser($email, $password);

        if ($userInstance !== null) {
            $session->createSession($userInstance->id);

            Response::respondSuccess(array(
                'userId' => $userInstance->id,
                'userEmail' => $userInstance->email,
                'userIsAdmin' => $userInstance->admin,
                'token' => $session->getToken()
            ));
        } else {
            Response::respondError(ERRORS::INVALID_CREDENTIALS);
        }
    }
}
