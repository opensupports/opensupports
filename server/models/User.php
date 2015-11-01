<?php
use RedBeanPHP\Facade as RedBean;

class User {
    const PROPERTIES = array(
        'user',
        'password',
        'admin',
    );
    const ERRORS = array(
        'UNDEFINED_CREDENTIALS' => 'User or password is not defined'
    );

    private $_id;
    private $_user;

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
        if ($user instanceof User) {
            RedBean::trash($user);
            unset($user);
            return true;
        }
        else {
            return false;
        }
    }

    public function __construct($user = null) {

        if ($user) {
            $this->_user = $user;
        }
        else {
            $this->_user = RedBean::dispense('users');
            $this->setDefaultProperties();
        }
    }

    public function setDefaultProperties() {

    }

    public function setProperties($properties) {

        foreach (self::PROPERTIES as $PROP) {
            $this->_user[$PROP] = $properties[$PROP];
        }
    }

    public function __get($name) {
        if ($this->_user[$name]) {
            return $this->_user[$name];
        }
        else {
            return null;
        }
    }

    public function store() {
        return RedBean::store($this->_user);
    }

    public function showUserDetails() {
        return $this->_user;
    }
}
