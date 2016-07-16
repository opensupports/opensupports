<?php

class LoginController extends Controller {
    const PATH = '/login';

    private $userInstance;
    private $session;
    private $rememberToken;

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

        if ($this->areCredentialsValid() || $this->isTokenValid()) {
            $this->createUserSession();
            $this->createSessionCookie();

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

    private function isTokenValid() {
        $rememberToken = Controller::request('rememberToken');

        if ($rememberToken) {
            $sessionCookie = SessionCookie::getDataStore($rememberToken, 'token');
            $userid = Controller::request('userId');

            if ($sessionCookie !== null && $userid === $sessionCookie->user->id) {
                $this->userInstance = $sessionCookie->user;
                return true;
            }
        }
    }

    private function createUserSession() {
        $this->getSession()->createSession($this->userInstance->id);
    }

    private function getUserData() {
        $userInstance = $this->getUserByInputCredentials();

        return array(
            'userId' => $userInstance->id,
            'userEmail' => $userInstance->email,
            'token' => $this->getSession()->getToken(),
            'rememberToken' => $this->rememberToken
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
    private function createSessionCookie(){
        $remember =  Controller::request('remember');
        if($remember){
            $this->rememberToken = Hashing::generateRandomToken();
            $sessionCookie = new SessionCookie();

            $sessionCookie->setProperties(array(
                'user' => $this->userInstance->getBeanInstance(),
                'token' => $this->rememberToken,
                'ip' => $_SERVER['REMOTE_ADDR'],
                'creationDate' =>  date('d-m-Y (H:i:s)')
            ));
            $sessionCookie->store();
        }
    }
}
