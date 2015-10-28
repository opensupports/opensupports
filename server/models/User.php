<?php
class User {
    private $_id;
    private $_user;

    private function __construct($id = 0) {
        $this->_id = $id;
        $this->_user = RedBean::load('users', $id);
    }

    public function showUserDetails() {
        return $this->_user;
    }
}
