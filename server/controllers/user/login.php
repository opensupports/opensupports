<?php

class LoginController extends Controller {
    const PATH = '/login';

    private $userInstance;
    private $session;
    
    public function validations() {
        return [
            'permission' => 'any',
            'requestData' => []
        ];
    }

    public function handler() {
        if ($this->isAlreadyLoggedIn()) {
            Response::respondError(ERRORS::SESSION_EXISTS);
            return;
        }

        if ($this->areCredentialsValid()) {
            $this->createUserSession();

            Response::respondSuccess($this->getUserData());
        } else {
            Response::respondError(ERRORS::INVALID_CREDENTIALS);
        }
    }

    private function isAlreadyLoggedIn() {
        return $this->getSession()->sessionExists();
    }

    private function areCredentialsValid() {
        return ($this->getUserByInputCredentials() !== null);
    }

    private function createUserSession() {
        $this->getSession()->createSession($this->userInstance->id);
    }

    private function getUserData() {
        $userInstance = $this->getUserByInputCredentials();

        return array(
            'userId' => $userInstance->id,
            'list' => count($userInstance->ownTicketList),
            'userEmail' => $userInstance->email,
            'token' => $this->getSession()->getToken()
        );
    }

    private function getUserByInputCredentials() {
        if ($this->userInstance === null) {
            $email =  Controller::request('email');
            $password =  Controller::request('password');

            $this->userInstance = User::authenticate($email, $password);
        }

        return $this->userInstance;
    }

    private function getSession() {
        if ($this->session === null) {
            $this->session = Session::getInstance();
        }

        return $this->session;
    }
}
