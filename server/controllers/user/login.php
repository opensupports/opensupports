<?php

class LoginController extends Controller {
    const PATH = '/login';

    private $userInstance;
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

        if ($this->checkInputCredentials() || $this->checkRememberToken()) {
            $this->createUserSession();
            $this->createSessionCookie();
            if(Controller::request('staff')) {
                $this->userInstance->lastLogin = Date::getCurrentDate();
                $this->userInstance->store();
            }
            
            Response::respondSuccess($this->getUserData());
        } else {
            Response::respondError(ERRORS::INVALID_CREDENTIALS);
        }
    }

    private function isAlreadyLoggedIn() {
        return Session::getInstance()->sessionExists();
    }

    private function checkInputCredentials() {
        $this->userInstance = $this->getUserByInputCredentials();
        
        return !$this->userInstance->isNull();
    }

    private function checkRememberToken() {
        $this->userInstance = $this->getUserByRememberToken();
        
        return !$this->userInstance->isNull();
    }

    private function createUserSession() {
        Session::getInstance()->createSession($this->userInstance->id, Controller::request('staff'));
    }

    private function getUserData() {
        $userInstance = $this->userInstance;

        return array(
            'userId' => $userInstance->id,
            'userEmail' => $userInstance->email,
            'staff' => Controller::request('staff'),
            'token' => Session::getInstance()->getToken(),
            'rememberToken' => $this->rememberToken
        );
    }

    private function getUserByInputCredentials() {
        $email =  Controller::request('email');
        $password =  Controller::request('password');

        if(Controller::request('staff')) {
            return Staff::authenticate($email, $password);
        } else {
            return User::authenticate($email, $password);
        }
    }
    
    private function getUserByRememberToken() {
        $rememberToken = Controller::request('rememberToken');
        $userInstance = new NullDataStore();

        if ($rememberToken) {
            $sessionCookie = SessionCookie::getDataStore($rememberToken, 'token');
            $userId = Controller::request('userId');

            if (!$sessionCookie->isNull() && $userId === $sessionCookie->user->id) {
                $userInstance = $sessionCookie->user;
                $sessionCookie->delete();
            }
        }
        
        return $userInstance;
    }

    private function createSessionCookie() {
        $remember =  Controller::request('remember');
        if ($remember) {
            $this->rememberToken = Hashing::generateRandomToken();

            $sessionCookie = new SessionCookie();
            $sessionCookie->setProperties(array(
                'user' => $this->userInstance,
                'token' => $this->rememberToken,
                'ip' => $_SERVER['REMOTE_ADDR'],
                'creationDate' =>  date('d-m-Y (H:i:s)')
            ));
            $sessionCookie->store();
        }
    }
}
