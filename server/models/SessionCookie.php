<?php

class SessionCookie extends DataStore {
    const TABLE = 'sessioncookie';

    public static function getProps() {
        return array (
            'user',
            'token',
            'ip',
            'creationDate',
            'expirationDate'
        );
    }
}
