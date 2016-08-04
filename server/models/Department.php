<?php

class Department extends DataStore {
    const TABLE = 'department';
    
    public function getProps() {
        return [
            'name',
            'sharedTicketList'
        ];
    }
}