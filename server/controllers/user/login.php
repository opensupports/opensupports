<?php

/**
 * @api {post} /user/login Login
 * @apiVersion 4.2.0
 *
 * @apiName Login
 *
 * @apiGroup User
 *
 * @apiDescription This path logs in an user.
 *
 * @apiPermission any
 *
 * @apiParam {Boolean} staff Indicates if it wants to login a staff or a regular user.
 * @apiParam {String} email The email of the user.
 * @apiParam {String} password The password of the user.
 * @apiParam {Boolean} remember Indicates if the session wants to be remembered.
 * @apiParam {Number} userId The id of the user to login.
 * @apiParam {String} rememberToken Token to login automatically. It replaces the password.
 *
 * @apiUse USER_SYSTEM_DISABLED
 * @apiUse SESSION_EXISTS
 * @apiUse UNVERIFIED_USER
 * @apiUse INVALID_CREDENTIALS
 *
 * @apiSuccess {Object} data Information about the session.
 * @apiSuccess {Number} data.userId Id of the user.
 * @apiSuccess {String} data.userEmail Email of the user.
 * @apiSuccess {Boolean} data.staff Indicates if the user is a staff.
 * @apiSuccess {String} data.token Token of the session, used to verify the session when making other requests.
 * @apiSuccess {String} data.rememberToken Token of the remember session for automatic login .
 *
 */

class LoginController extends Controller {
    const PATH = '/login';
    const METHOD = 'POST';

    private $userInstance;
    private $rememberToken;

    public function validations() {
        return [
            'permission' => 'any',
            'requestData' => []
        ];
    }

    public function handler() {
        if(!Controller::isUserSystemEnabled() && !Controller::request('staff')) {
            throw new Exception(ERRORS::USER_SYSTEM_DISABLED);
        }

        if ($this->isAlreadyLoggedIn()) {
            throw new Exception(ERRORS::SESSION_EXISTS);
        }

        if ($this->checkInputCredentials() || $this->checkRememberToken()) {
            if($this->userInstance->verificationToken !== null) {
                throw new Exception(ERRORS::UNVERIFIED_USER);
            }

            $this->createUserSession();
            $this->createSessionCookie();
            if(Controller::request('staff')) {
                $this->userInstance->lastLogin = Date::getCurrentDate();
                $this->userInstance->store();
            }

            Response::respondSuccess($this->getUserData());
        } else {
            throw new Exception(ERRORS::INVALID_CREDENTIALS);
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
