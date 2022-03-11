<?php

ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_secure', getenv('IS_DOCKER') ? 0 : 1);

class Session {
    use SingletonTrait;

    private $sessionPrefix = '';

    private function __construct() {
        $this->initSession();
    }

    public function initSession() {
        if (isset($_COOKIE["OS4SESSID"])) {
            $sessionId = $_COOKIE["OS4SESSID"];

            // TODO: Delete, this is just for testing purposes.
            $data = $sessionId;
            error_log("Already existing session id from cookie: ", 3, "/var/tmp/my-errors.log");
            error_log(print_r($data, true), 3, "/var/tmp/my-errors.log");
            error_log("\n", 3, "/var/tmp/my-errors.log");
        }

        if(Controller::request('session_id')) {
            // TODO: Delete, this is just for testing purposes.
            $data = Controller::request('session_id');
            error_log(print_r($data, true), 3, "/var/tmp/my-errors.log");
            error_log("\n", 3, "/var/tmp/my-errors.log");

            session_id(Controller::request('session_id'));
        }

        if(Controller::isProductionEnv()) {
            AWSClients::registerSessionHandler();
        }

        session_start();
        setcookie("OS4SESSID", session_id(), time() + 3600 * 24 * 30);
    }

    public function closeSession() {
        session_destroy();
    }

    public function clearSessionData() {
        $this->store('userId', null);
        $this->store('staff', null);
        $this->store('token', null);
        $this->store('ticketNumber', null);
    }

    public function setSessionData($data) {
        foreach($data as $key => $value)
            $this->store($key, $value);
    }

    public function createSession($userId, $staff = false, $ticketNumber = null) {
        session_regenerate_id();
        $this->store('userId', $userId);
        $this->store('staff', $staff);
        $this->store('ticketNumber', $ticketNumber);
        $this->store('token', Hashing::generateRandomToken());
    }

    public function isTicketSession() {
        return $this->getStoredData('ticketNumber') && $this->getStoredData('token');
    }

    public function getTicketNumber() {
        return $this->getStoredData('ticketNumber');
    }

    public function getUserId() {
        return $this->getStoredData('userId');
    }

    public function getToken() {
        return $this->getStoredData('token');
    }

    public function sessionExists() {
        return !!$this->getToken();
    }

    public function isStaffLogged() {
        return $this->getStoredData('staff');
    }

    public function checkAuthentication($data) {
        $userId = $this->getStoredData('userId');
        $token = $this->getStoredData('token');

        return $userId && $token &&
               $userId === $data['userId'] &&
               $token === $data['token'];
    }

    public function store($key, $value) {
        $_SESSION[$key] = $value;
    }

    private function getStoredData($key) {
        $storedValue = null;

        if (array_key_exists($key, $_SESSION)) {
            $storedValue = $_SESSION[$key];
        }

        return $storedValue;
    }

    public function isLoggedWithId($userId) {
        return ($this->getStoredData('userId') === $userId);
    }

    public function setSessionPrefix($prefix) {
        $this->sessionPrefix = $prefix;
    }
}
