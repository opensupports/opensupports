<?php

class Session {
    static $instance = null;

    private function __construct() {
        $this->initSession();
    }

    public function initSession() {
        session_cache_limiter(false);
        session_start();
    }

    public function closeSession() {
        session_destroy();
    }

    public static function getInstance() {
        if (!self::$instance) {
            self::$instance = new Session();
        }

        return self::$instance;
    }

    public function createSession($userId, $staff = false) {
        $this->store('userId', $userId);
        $this->store('staff', $staff);
        $this->store('token', Hashing::generateRandomToken());
    }
    
    public function createTicketSession($ticketNumber) {
        $this->store('ticketNumber', $ticketNumber);
        $this->store('token', Hashing::generateRandomToken());
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
}