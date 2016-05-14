<?php

class User extends DataStore {
    const TABLE = 'user';

    public static function authenticate($userEmail, $userPassword) {
        $user = User::getUser($userEmail, 'email');

        return ($user && Hashing::verifyPassword($userPassword, $user->password)) ? $user : null;
    }

    public static function getProps() {
        return array(
            'email',
            'password',
            'name',
            'verificationToken',
            'ownTickets'
        );
    }

    public function getDefaultProperties() {
        return array(
            'ownTickets' => []
        );
    }

    public function addTicket($ticket) {
        $this->ownTickets[] = $ticket;
    }

    public static function getUser($value, $property = 'id') {
        return parent::getDataStore($value, $property);
    }
}
