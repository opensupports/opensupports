<?php

class Department extends DataStore {
    const TABLE = 'department';
    
    public static function getProps() {
        return [
            'name',
            'sharedTicketList'
        ];
    }
}