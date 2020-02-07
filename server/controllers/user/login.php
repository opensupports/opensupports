<?php
use RedBeanPHP\Facade as RedBean;

/**
 * @api {post} /user/login Login
 * @apiVersion 4.6.1
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
    private $rememberExpiration;

    public function validations() {
        return [
            'permission' => 'any',
            'requestData' => []
        ];
    }

    public function handler() {
        if(!Controller::isUserSystemEnabled() && !Controller::request('staff')) {
            throw new RequestException(ERRORS::USER_SYSTEM_DISABLED);
        }

        if ($this->isAlreadyLoggedIn()) {
            throw new RequestException(ERRORS::SESSION_EXISTS);
        }

        $this->clearOldRememberTokens();

        if ($this->checkInputCredentials() || $this->checkRememberToken()) {
            if($this->userInstance->verificationToken !== null) {
                throw new RequestException(ERRORS::UNVERIFIED_USER);
            }

            if($this->userInstance->disabled) {
                throw new RequestException(ERRORS::USER_DISABLED);
            }

            $this->createUserSession();
            $this->createRememberToken();
            if(Controller::request('staff')) {
                $this->userInstance->lastLogin = Date::getCurrentDate();
                $this->userInstance->store();
            }

            Response::respondSuccess($this->getUserData());
        } else {
            throw new RequestException(ERRORS::INVALID_CREDENTIALS);
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
            'staff' => !!Controller::request('staff'),
            'token' => Session::getInstance()->getToken(),
            'rememberToken' => $this->rememberToken,
            'rememberExpiration' => $this->rememberExpiration
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

    private function clearOldRememberTokens() {
        $currentDate = Date::getCurrentDate();

        try {
            RedBean::exec("DELETE FROM sessioncookie WHERE expiration_date < $currentDate");
        } catch(Exception $e) {}
    }

    private function createRememberToken() {
        $remember = Controller::request('remember');

        if (!Controller::request('staff') && $remember) {
            $this->rememberToken = Hashing::generateRandomToken();
            $this->rememberExpiration = Date::getNextDate(30);

            $sessionCookie = new SessionCookie();
            $sessionCookie->setProperties(array(
                'user' => $this->userInstance,
                'token' => $this->rememberToken,
                'ip' => $_SERVER['REMOTE_ADDR'],
                'creationDate' =>  Date::getCurrentDate(),
                'expirationDate' => $this->rememberExpiration
            ));

            $sessionCookie->store();
        }
    }
}
