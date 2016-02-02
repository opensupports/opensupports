<?php

class User extends DataStore {
    const TABLE = 'users';

    public static function hashPassword($password) {
        return password_hash($password);
    }

    public static function verifyPassword($password, $hash) {
        return password_verify($password, $hash);
    }

    public static function authenticate($userEmail, $userPassword) {
        $user = static::getUser($userEmail, 'email');

        return ($user && static::verifyPassword($userPassword, $user->password)) ? $user : null;
    }

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
