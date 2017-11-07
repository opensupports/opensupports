<?php
class SessionCookie extends \Mock {
    public static $functionList = array();
    public $user;

    public static function getDataStore() {
        return new SessionCookie();
    }

    public function __construct() {
        $this->user = new \Mock();
        $this->user->id = 'MOCK_ID';
    }

    public function isNull() {
        return false;
    }

    public function setProperties() {
        return null;
    }

    public function store() {
        return null;
    }
}
