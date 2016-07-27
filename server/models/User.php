<?php
use RedBeanPHP\Facade as RedBean;

class User extends DataStore {
    const TABLE = 'user';

    public static function authenticate($userEmail, $userPassword) {
        $user = User::getUser($userEmail, 'email');

        return ($user && Hashing::verifyPassword($userPassword, $user->password)) ? $user : new NullDataStore();
    }

    public static function getProps() {
        return array(
            'email',
            'password',
            'name',
            'verificationToken'
        );
    }

    public function getDefaultProps() {
        return array();
    }

    public function addTicket(Ticket $ticket) {
        $this->getBeanInstance()->sharedTicketList[] = $ticket->getBeanInstance();
    }

    public static function getUser($value, $property = 'id') {
        return parent::getDataStore($value, $property);
    }
}
