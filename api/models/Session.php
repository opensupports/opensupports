<?php

class Session {
    private $instance = null;

    private function __construct() {}

    public function initSession() {
        session_start();
    }

    public function closeSession() {
        session_destroy();
    }

    public function getInstance() {
        if (!$this->instance) {
            $this->instance = new Session();
        }

        return $this->instance;
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
        return $this->getStoredData('userId') === $data['userId'] &&
               $this->getStoredData('token') === $data['token'];
    }

    public function isLoggedWithId($userId) {
        return ($this->getStoredData('userId') === $userId);
    }

    private function store($key, $value) {
        $_SESSION[$key] = $value;
    }

    private function getStoredData($key) {
        return $_SESSION[$key] || null;
    }

    private function generateToken() {
        return md5(uniqid(rand()));
    }
}