<?php

class APIKey extends DataStore {
    const TABLE  = 'apikey';

    public static function getProps() {
        return [
            'name',
            'key'
        ];
    }
    public function toArray() {
        return [
            'name' => $this->name,
            'key' => $this->key
        ];
    }
}