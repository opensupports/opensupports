<?php
class RecoverPassword extends DataStore {
    const TABLE = 'recoverpassword';

    public static function getProps() {
        return array (
            'email',
            'token',
            'staff'
        );
    }

    public function getDefaultProps() {
        return array();
    }
}
