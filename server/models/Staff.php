<?php

class Staff extends DataStore {
    const TABLE = 'staff';

    public static function authenticate($userEmail, $userPassword) {
        $user = Staff::getUser($userEmail, 'email');

        return ($user && Hashing::verifyPassword($userPassword, $user->password)) ? $user : new NullDataStore();
    }

    public static function getProps() {
        return [
            'name',
            'email',
            'password',
            'profilePic',
            'level',
            'sharedDepartmentList',
            'sharedTicketList',
            'lastLogin',
            'ownStatList'
        ];
    }

    public function getDefaultProps() {
        return [
            'level' => 1,
            'ownStatList' => new DataStoreList()
        ];
    }

    public static function getUser($value, $property = 'id') {
        return parent::getDataStore($value, $property);
    }

    public function toArray() {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'profilePic' => $this->profilePic,
            'level' => $this->level,
            'departments' => $this->sharedDepartmentList->toArray(),
            'tickets' => $this->sharedTicketList->toArray(),
            'lastLogin' => $this->lastLogin
        ];
    }
}
