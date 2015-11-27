<?php
use RedBeanPHP\Facade as RedBean;

class User extends DataStore {
    const TABLE = 'users';
    const PROPERTIES = array(
        'user',
        'password',
        'admin',
    );

    public static function getUser($value, $property = 'id') {
        return parent::getDataStore($value, $property);
    }

    public static function deleteUser($user) {
        parent::deleteDataStore($user);
    }

    public function getDefaultProperties() {
        return [
            'admin' => 0
        ];
    }

    public function showUserDetails() {
        return $this->_user;
    }
}
