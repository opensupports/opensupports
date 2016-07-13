<?php

class LoginController extends Controller {
    const PATH = '/login';

    private $userInstance;
    private $session;
    private $remembertoken;
    
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

    private function createUserSession() {
        $this->getSession()->createSession($this->userInstance->id);
    }

    private function getUserData() {
        $userInstance = $this->getUserByInputCredentials();

        return array(
            'userId' => $userInstance->id,
            'userEmail' => $userInstance->email,
            'token' => $this->getSession()->getToken(),
            'rememberToken' => $this->remembertoken
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
    private function isTokenValid(){
        $sessioncookie = SessionCookie::getDataStore(Controller::request('rememberToken'),'token');
        if($sessioncookie !== null){
            $this->userInstance = $sessioncookie->user;
            return true;
        }
    }
    private function createSessionCookie(){
        $remember =  Controller::request('remember');
        if($remember){
            $this->remembertoken = md5(uniqid(rand()));

            $sessioncookie = new SessionCookie();

            $sessioncookie->setProperties(array(
                'user' => $this->userInstance->getBeanInstance(),
                'token' => $this->remembertoken
            ));
            $sessioncookie->store();
        }
    }
}
