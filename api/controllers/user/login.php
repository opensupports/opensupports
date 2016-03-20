<?php

class LoginController extends Controller {
    const PATH = '/login';

    public function handler() {
        $email =  Controller::request('email');
        $password =  Controller::request('password');

        $user = User::getUser($email, 'email');

        if ($user === null || $user->password !== $password) {
            Response::respondError(ERRORS::INVALID_CREDENTIALS);
            return;
        }

        Response::respondSuccess();
        return;
    }
}
