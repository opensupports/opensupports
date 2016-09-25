<?php

class Staff extends DataStore {
    const TABLE = 'staff';


    public static function getProps() {
        return [
            'name',
            'email',
            'password',
            'profilePic',
            'level',
            'sharedDepartmentList',
            'sharedTicketList'
        ];
    }

    public function getDefaultProps() {
        return [
            'level' => 1
        ];
    }

    public static function getUser($value, $property = 'id') {
        return parent::getDataStore($value, $property);
    }
}
