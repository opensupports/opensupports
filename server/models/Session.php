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

    public function createSession($userId) {
        $this->store('userId', $userId);
        $this->store('token', $this->generateToken());
    }

    public function getToken() {
        return $this->getStoredData('token');
    }

    public function sessionExists() {
        return !!$this->getToken();
    }

    public function checkAuthentication($data) {
        $userId = $this->getStoredData('userId');
        $token = $this->getStoredData('token');
        
        return $userId && $token &&
               $userId === $data['userId'] &&
               $token === $data['token'];
    }

    public function isLoggedWithId($userId) {
        return ($this->getStoredData('userId') === $userId);
    }

    private function store($key, $value) {
        $_SESSION[$key] = $value;
    }

    private function getStoredData($key) {
        $storedValue = null;

        if (array_key_exists($key, $_SESSION)) {
            $storedValue = $_SESSION[$key];
        }

        return $storedValue;
    }

    private function generateToken() {
        return Hashing::generateRandomToken();;
    }
}