<?php
use RedBeanPHP\Facade as RedBean;

class User extends DataStore {
    const TABLE = 'users';
    const PROPERTIES = array(
        'user',
        'password',
        'admin',
    );
    const ERRORS = array(
        'UNDEFINED_CREDENTIALS' => 'User or password is not defined'
    );

    public static function getUser($value, $property = 'id') {
        if ($property === 'id') {
            $mapValue = 'id=:value';
        }
        else if ($property === 'user') {
            $mapValue = 'user=:value';
        }

        $user = RedBean::findOne('users', $mapValue, array(':value'  => $value));

        return ($user) ? new User($user) : null;
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
