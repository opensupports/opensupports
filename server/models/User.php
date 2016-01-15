<?php

class User extends DataStore {
    const TABLE = 'users';

    public static function getProps() {
        return array(
            'email',
            'password',
            'admin',
        );
    }

    public function getDefaultProperties() {
        return [
            'admin' => 0
        ];
    }

    public static function getUser($value, $property = 'id') {
        return parent::getDataStore($value, $property);
    }

    public static function deleteUser($user) {
        parent::deleteDataStore($user);
    }

    public function showUserDetails() {
        return $this->_user;
    }
}
