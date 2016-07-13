<?php

class SessionCookie extends DataStore {
    const TABLE = 'session';

    public static function getProps() {
        return array (
            'user',
            'token',
            'ip',
            'creationDate',
            'expirationDate'
        );

    }

    protected function getDefaultProps() {
        return array();
    }
}