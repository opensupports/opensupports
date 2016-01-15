<?php

class Session {
    private $instance = null;

    private  function __construct() {}

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
        $this->store('userid', $userId);
        $this->store('token', $this->generateToken());
    }

    public function getToken() {
        return $this->getStoredData('token');
    }

    public function checkAuthentication($data) {
        return $this->getStoredData('user_id') === $data['user_id'] &&
               $this->getStoredData('token') === $data['token'];
    }

    private function store($key, $value) {
        $_SESSION[$key] = $value;
    }

    private function getStoredData($key) {
        return $_SESSION[$key];
    }

    private function generateToken() {
        return md5(uniqid(rand()));
    }
}