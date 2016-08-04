<?php
use RedBeanPHP\Facade as RedBean;

class User extends DataStore {
    const TABLE = 'user';

    public static function authenticate($userEmail, $userPassword) {
        $user = User::getUser($userEmail, 'email');

        return ($user && Hashing::verifyPassword($userPassword, $user->password)) ? $user : new NullDataStore();
    }

    public static function getProps() {
        return [
            'email',
            'password',
            'name',
            'admin',
            'sharedTicketList',
            'verificationToken',
        ];
    }

    public function getDefaultProps() {
        return [
            'admin' => 0
        ];
    }

    public static function getUser($value, $property = 'id') {
        return parent::getDataStore($value, $property);
    }
}
