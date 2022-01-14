<?php
class Supervisedrelation extends DataStore {
    const TABLE = 'supervisedrelation';

    public static function getProps() {
        return[
            'sharedUserList'
        ];
    }

    public function getDefaultProps() {
        return array();
    }

    public function toArray() {
        return [ 
           'supervisedrelation' => $this->sharedUserList
        ];
    }
}